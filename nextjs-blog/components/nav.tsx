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
            pageName: 'Reading'
        }
    ]
    type RouteAttrs = {
        route: string;
        pageName: string
    }

    const [routes, setRoutes] = useState<RouteAttrs[]>(routeOptions)
    return (
        <div>
            <nav>
                {routes.map( (routeOption: RouteAttrs) => (
                    <ActiveLink key={routeOption.pageName} hrefLink={routeOption.route} pageName={(routeOption.pageName)}>
                        {routeOption.pageName}
                    </ActiveLink>
                ))}
            </nav>
        </div>
    )
}