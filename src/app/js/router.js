/*
 * @Author: 詹真琦(legendryztachi@gmail.com) 
 * @Date: 2017-12-21 10:42:29 
 * @Description: 整站路由
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-21 16:22:41
 */
import {page2} from './page2/page2';

import {page3} from './page3/page3';
    import {page4} from './page3/page4/page4';
    import {page5} from './page3/page5/page5';

const routes=[
    {
        path:'/page2',
        component:page2,
        props:(router)=>({query:router.query})
    },
    {
        path:'/page3',
        name:'page3',
        component:page3,
        props:(router)=>({query:router.query}),
        children:[//嵌套路由
            {
                path:'page4',
                component:page4,
                props:(router)=>({query:router.query})
            },
            {
                path:'page5',
                component:page5,
                props:(router)=>({query:router.query})
            }
        ]
    }
]



export const router=new VueRouter({
    routes
})