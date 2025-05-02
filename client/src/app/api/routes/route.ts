import { INode } from "../../../components/modules/configuration/routes/useTree";
import { FileCreator } from "../../../lib/utils/path";

export async function GET() {
    try {
        // const routes = await prisma.route.findMany({
        //     where: {
        //         status: true,
        //     },
        //     include: {
        //         children: true,
        //         PermissionRoute: {
        //             select: {
        //                 Permission: {
        //                     select: {
        //                         name: true,
        //                         id: true,
        //                     },
        //                 },
        //             },
        //         },
        //     },
        // });
        // return new Response(
        //     JSON.stringify({
        //         message: "Folder created successfully",
        //         data: routes,
        //     }),
        //     {
        //         status: 200,
        //         headers: { "Content-Type": "application/json" },
        //     },
        // );
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
