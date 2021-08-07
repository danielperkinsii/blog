import ActiveLink from './activeLink'
import { useState } from 'react'

export default function nav() {
    const routeOptions = [
        {
            'route': '/',
            'pageName': 'Blog'
        },
        {
            'route': '/about',
            'pageName': 'About'
        },
        {
            'route': '/reading',
            'pageName': 'Reading'
        }
    ]

    const [routes, setRoutes] = useState(routeOptions)
    return (
        <>
            <nav>
                {routes.map( routeOption => (
                    <ActiveLink key={routeOption.pageName} hrefLink={routeOption.route} pageName={routeOption.pageName}>
                        {routeOption.pageName}
                    </ActiveLink>
                ))}
            </nav>
        </>
    )
}