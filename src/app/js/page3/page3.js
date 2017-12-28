export const page3 = {
    props: ['query'],
    template: '<div>page3:我是{{query.msg}}' +
        '<router-link :to="{path:\'/page3/page4\',query:{msg:query.msg,msg_1:\'page4\'}}">page4</router-link>' +
        '<router-link :to="{path:\'/page3/page5\',query:{msg:query.msg,msg_1:\'page5\'}}">page5</router-link>' +
        '<router-view></router-view></div>'
};