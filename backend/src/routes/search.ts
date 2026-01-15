import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { asyncHandler, BadRequestError } from '../middleware/errorHandler';

const router = Router();

// GET /api/search?q=xxx - 横断検索（ニュース、メンバー、グループ）
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { q, type, limit = '10' } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      throw new BadRequestError('Search query (q) is required');
    }

    const searchQuery = q.trim();
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));

    // Determine which types to search
    const searchTypes = type
      ? (type as string).split(',').map((t) => t.trim().toLowerCase())
      : ['news', 'members', 'groups'];

    const results: any = {};

    // Search in parallel
    const searchPromises: Promise<void>[] = [];

    // Search News
    if (searchTypes.includes('news')) {
      searchPromises.push(
        prisma.news
          .findMany({
            where: {
              OR: [
                { title: { contains: searchQuery, mode: 'insensitive' } },
                { content: { contains: searchQuery, mode: 'insensitive' } },
                { excerpt: { contains: searchQuery, mode: 'insensitive' } },
              ],
            },
            take: limitNum,
            orderBy: { publishedAt: 'desc' },
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              excerpt: true,
              thumbnailUrl: true,
              publishedAt: true,
            },
          })
          .then((news) => {
            results.news = news.map((item) => ({
              ...item,
              _type: 'news',
            }));
          })
      );
    }

    // Search Members
    if (searchTypes.includes('members')) {
      searchPromises.push(
        prisma.member
          .findMany({
            where: {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { nameKana: { contains: searchQuery, mode: 'insensitive' } },
                { nameEn: { contains: searchQuery, mode: 'insensitive' } },
                { nickname: { contains: searchQuery, mode: 'insensitive' } },
              ],
            },
            take: limitNum,
            orderBy: { displayOrder: 'asc' },
            select: {
              id: true,
              name: true,
              nameKana: true,
              slug: true,
              nickname: true,
              profileImageUrl: true,
              status: true,
              memberGroupHistory: {
                where: { isCurrent: true },
                select: {
                  group: {
                    select: {
                      id: true,
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          })
          .then((members) => {
            results.members = members.map((member) => ({
              id: member.id,
              name: member.name,
              nameKana: member.nameKana,
              slug: member.slug,
              nickname: member.nickname,
              profileImageUrl: member.profileImageUrl,
              status: member.status,
              currentGroups: member.memberGroupHistory.map((mgh) => mgh.group),
              _type: 'member',
            }));
          })
      );
    }

    // Search Groups
    if (searchTypes.includes('groups')) {
      searchPromises.push(
        prisma.group
          .findMany({
            where: {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { nameKana: { contains: searchQuery, mode: 'insensitive' } },
                { nameEn: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
              ],
            },
            take: limitNum,
            orderBy: { displayOrder: 'asc' },
            select: {
              id: true,
              name: true,
              nameKana: true,
              slug: true,
              description: true,
              status: true,
              imageUrl: true,
              colorCode: true,
            },
          })
          .then((groups) => {
            results.groups = groups.map((group) => ({
              ...group,
              _type: 'group',
            }));
          })
      );
    }

    await Promise.all(searchPromises);

    // Calculate total results
    const totalResults = Object.values(results).reduce(
      (sum: number, arr: any) => sum + (arr?.length || 0),
      0
    );

    res.json({
      success: true,
      data: results,
      meta: {
        query: searchQuery,
        totalResults,
        types: searchTypes,
      },
    });
  })
);

export default router;
