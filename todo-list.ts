// TODO:
/*

    * Project Table
    * - id: string
    * - name: string
    * - icon: string (optional)
    * - logo: string (optional)
    * - slug: string
    * - metadata: JSON (optional)
    * - description: string
    * - createdAt: Date
    * - updatedAt: Date
    * -status: string (e.g., 'active', 'archived')
    *
    * Route Table
    * - id: string
    * - projectId: string (foreign key to Project Table)
    * - name: string
    * - slug: string
    * - description: string
    * - createdAt: Date
    * - updatedAt: Date
    * - status: string (e.g., 'active', 'archived')
    * - metadata: JSON (optional)
    * - permissions: JSON (optional)
    * 
    * Component Table
    * - id: string
    * - routeId: string (foreign key to Route Table)
    * - name: string
    * - type: string (e.g., 'form', 'table', 'chart')
    * - slug: string
    * - description: string
    * - createdAt: Date
    * - updatedAt: Date
    * - status: string (e.g., 'active', 'archived')
    * - metadata: JSON (optional)
    * - permissions: JSON (optional)
*/
