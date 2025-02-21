import { FileCreator } from "@lib/utils/path";
import prisma from "@lib/utils/prisma";
import { INode } from "@ui/settings/routes/useTree";

import { z } from "zod";

const RouteSchema = z.object({
    id: z.string(),
    type: z.enum(["guest", "shared", "protected", "devOnly"]),
    name: z.string(),
    slug: z.string(),
    path: z.string(),
    isComponent: z.boolean(),
    parentId: z.string().nullable(),
    permissions: z.array(z.string()),
});

const PermissionRoute = z.object({
    permissionId: z.string().uuid(),
    routeId: z.string(),
});

type TPermissionRoute = z.infer<typeof PermissionRoute>;

export async function GET() {
    try {
        const routes = await prisma.route.findMany({
            where: {
                status: true,
            },
            include: {
                children: true,
                PermissionRoute: {
                    select: {
                        Permission: {
                            select: {
                                name: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });

        return new Response(
            JSON.stringify({
                message: "Folder created successfully",
                data: routes,
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                error,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}

export async function POST(req: Request) {
    try {
        const body: INode = await req.json();

        const routes = Object.values(body);

        const routeData = routes.map(route =>
            RouteSchema.parse({
                id: route.id,
                type: route.type,
                name: route.name,
                path: route.path,
                slug: route.name.toLowerCase().replace(/\s/g, "-"),
                isComponent: route.isComponent,
                parentId: route.parentId,
                permissions: route.permissions,
            }),
        );
        // Begin transaction
        await prisma.$transaction(async prisma => {
            // 1. Insert route data
            await prisma.route.createMany({
                data: routeData.map(route => ({
                    id: route.id,
                    type: route.type,
                    name: route.name,
                    slug: route.slug,
                    path: route.path,
                    isComponent: route.isComponent,
                    parentId: route.parentId,
                })),
                skipDuplicates: true, // Avoid duplicate inserts
            });

            // 2. Insert Route Permission data
            const routePermission: TPermissionRoute[] = [];
            routeData.forEach(route => {
                route.permissions.forEach(permissionId => {
                    routePermission.push({
                        permissionId,
                        routeId: route.id,
                    });
                });
            });
            // Insert RolePermission records
            await prisma.permissionRoute.createMany({
                data: routePermission,
                skipDuplicates: true, // Avoid duplicate inserts
            });
        });

        const app = new FileCreator("src/app", routes);
        const ui = new FileCreator("src/ui", routes);

        await app.createPages();

        await ui.createComponents();

        return new Response(JSON.stringify({ message: "Folder created successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({
                error: error,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            },
        );
    }
}
