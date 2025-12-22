import ActiveLink from './activeLink'
import { useState } from 'react'

export default function nav() {
    const routeOptions = [
        {
            route: '/',
            pageName: 'Home'
        },
        {
            route: '/about',
            pageName: 'About'
        },
        {
            route: '/reading',
            pageName: 'Vlogs'
        }
    ]
    type RouteAttrs = {
        route: string;
        pageName: string
    }

    const [routes, setRoutes] = useState<RouteAttrs[]>(routeOptions)
    return (
        <div className="sticky top-0 z-50 bg-white w-full flex justify-center">
            <nav className="max-w-4xl mx-auto px-4 py-4">
                {routes.map( (routeOption: RouteAttrs) => (
                    <ActiveLink key={routeOption.pageName} hrefLink={routeOption.route} pageName={(routeOption.pageName)}>
                        {routeOption.pageName}
                    </ActiveLink>
                ))}
            </nav>
        </div>
    )
}