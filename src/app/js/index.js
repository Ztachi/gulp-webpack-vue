/*
 * @Author: 詹真琦(legendryztachi@gmail.com) 
 * @Date: 2017-12-21 10:50:57 
 * @Description: 页面框架
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-21 17:23:57
 */
//http://music.migu.cn/music-migu-web/migumusic/resources/20017
import {router} from './router';

const app=new Vue({
    el:'#app',
    data:{
        msg:'gulp+webpack+vue',
        list:[],
        id:'20017'
    },
    computed:{
        clip(){
            return this.msg.slice(13);
        }
    },
    watch:{
        id(){
            this.getList();
        }
    },
    methods:{
        getList(){
            if(this.id.length<5)return;
            let that=this;
            $.ajax({
                url:'http://music.migu.cn/music-migu-web/migumusic/resources/'+this.id,
                dataType:'json',
                success(d){
                    that.list=d.items||[];
                }
            })
        }
    },
    created(){
        this.getList();
    },
    router
})

window.vm=app;