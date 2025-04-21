import { v4 as uuid4 } from "uuid";
import GUEST_ROUTES from "./GUEST_ROUTES";
import { PROTECTED_ROUTES } from "./PROTECTED_ROUTES";
import SHARED_ROUTES from "./SHARED_ROUTES";

let routes = [...GUEST_ROUTES, ...SHARED_ROUTES, ...PROTECTED_ROUTES];

routes = routes.map(route => {
    route.id = uuid4();
    return route;
});

export default routes;
