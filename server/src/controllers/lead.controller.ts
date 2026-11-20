import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { LeadQueryParams } from '../schemas/lead.schema';

export async function getLeads(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const query = req.query as unknown as LeadQueryParams;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order || 'desc';
    const search = (query.search || '').trim();
    const status = (query.status || '').trim();

    // Construct filter conditions strictly scoped to the authenticated user
    const whereClause: any = {
      userId,
    };

    if (status && ['New', 'Contacted', 'Qualified', 'Lost'].includes(status)) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { company: { contains: search } },
      ];
    }

    // Run parallel queries: paginated results, matching count, and status breakdown metrics
    const [leads, totalMatching, totalUserLeads, newCount, contactedCount, qualifiedCount, lostCount] =
      await Promise.all([
        prisma.lead.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { [sortBy]: order },
        }),
        prisma.lead.count({ where: whereClause }),
        prisma.lead.count({ where: { userId } }),
        prisma.lead.count({ where: { userId, status: 'New' } }),
        prisma.lead.count({ where: { userId, status: 'Contacted' } }),
        prisma.lead.count({ where: { userId, status: 'Qualified' } }),
        prisma.lead.count({ where: { userId, status: 'Lost' } }),
      ]);

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        totalCount: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1,
      },
      metrics: {
        total: totalUserLeads,
        new: newCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        lost: lostCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { name, email, phone, company, source, status } = req.body;

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        company,
        source: source || 'Website',
        status: status || 'New',
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Strict ownership verification: query must match both lead id and authenticated userId
    const lead = await prisma.lead.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!lead) {
      res.status(404).json({
        success: false,
        error: 'Lead not found or you do not have permission to access it.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { name, email, phone, company, source, status } = req.body;

    // Verify ownership before updating
    const existing = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Lead not found or you do not have permission to modify it.',
      });
      return;
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(company !== undefined && { company }),
        ...(source !== undefined && { source }),
        ...(status !== undefined && { status }),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Verify ownership before deleting
    const existing = await prisma.lead.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      res.status(404).json({
        success: false,
        error: 'Lead not found or you do not have permission to delete it.',
      });
      return;
    }

    await prisma.lead.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
