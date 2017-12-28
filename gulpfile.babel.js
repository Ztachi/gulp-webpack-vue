/*
 * @Author: 詹真琦(legendryztachi@gmail.com)
 * @Date: 2017-12-08 15:18:50 
 * @Description: 
 * @Last Modified by: 詹真琦(legendryztachi@gmail.com)
 * @Last Modified time: 2017-12-28 08:53:46
 */

import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';
import through2 from 'through2';
import path from 'path';
import fs from 'fs';
import sass from 'gulp-sass';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import browserSync from 'browser-sync';
import sequence from 'run-sequence';
import plumber from 'gulp-plumber';
import watch from 'gulp-watch';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';
import cache from 'gulp-cache';
import concat from 'gulp-concat';
import htmlmin from 'gulp-htmlmin';
import named from 'vinyl-named';
import webpack from 'webpack-stream';
import gulpif from 'gulp-if';
import filter from 'gulp-filter';

const browserSyncCreate = browserSync.create();
const reload = browserSyncCreate.reload;

const paths = {
    src: path.resolve(__dirname, './src'),
    app: path.resolve(__dirname, './src/app'),
    common: path.resolve(__dirname, './src/app/common'),
    js: path.resolve(__dirname, './src/app/js'),
    css: path.resolve(__dirname, './src/app/css'),
    img: path.resolve(__dirname, './src/app/img'),
    svg: path.resolve(__dirname, './src/app/svg'),
    widget: path.resolve(__dirname, './src/widget'),
    static: path.resolve(__dirname, './src/static'),
    staticCommon: path.resolve(__dirname, './src/static/common'),
    staticJs: path.resolve(__dirname, './src/static/js'),
    staticCss: path.resolve(__dirname, './src/static/css'),
    staticImg: path.resolve(__dirname, './src/static/img'),
    staticSvg: path.resolve(__dirname, './src/static/svg'),
    dist: path.resolve(__dirname, './dist')
}

// 保存定时器，限制浏览器刷新频率
let reloadTimer = null;
//是否是打包
let release = false;
//是否需要重新运行webpack编译(用于js写到一半自动保存导致编译错误)
let reStart = false;

function reloadBrowser() {
    // # watch src资源, 调用相关任务预处理
    // # 刷新浏览器
    // # 限制浏览器刷新频率

    watch(paths.src + "/**/*", (obj) => {
        let url = obj.path.replace(/\\/g, "/");
        let absurl = url;
        url = path.relative(paths.src, url).replace(/\\/g, "/");
        gutil.log(gutil.colors.bgGreen("[KS] " + absurl));

        // skip scss & css
        if (!/\.scss$/.test(url) && !/\.css$/.test(url)) {
            if (reStart) { //如果之前编译报错，就重新编译
                js();
            }
            if (reloadTimer) {
                clearTimeout(reloadTimer);
            }
            reloadTimer = setTimeout(reload, 1000);
        }
    });
}

//编译sass
function f_sass() {
    return gulp.src(paths.css + '/**/*.{scss,css}')
        .pipe(plumber())
        .pipe(sass({
                precision: 2,
                outputStyle: release ? "compressed" : "expanded"
            })
            .on("error", sass.logError))
        .pipe(gulpif(release, autoprefixer({
            browsers: ['last 30 versions'], //兼容版本
            cascade: true, //是否美化属性值
            remove: false //是否去掉不必要的前缀
        })))
        .pipe(gulp.dest(paths.staticCss))
        .pipe(reload({
            stream: true
        }));
}

//编译js
function f_js() {
    reStart = false;
    return gulp.src(paths.js + '/**/*.js')
        .pipe(webpack(require('./webpack.config')).on('error', (e) => {
            gutil.log(gutil.colors.bgRed('[webpack]:' + e));
            reStart = true;
        }))
        .pipe(gulp.dest(paths.staticJs));
}

//压缩js
function f_jsmin() {
    return gulp.src(paths.staticJs + '/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(paths.staticJs));
}

//复制工具类JS,原本就压缩过的文件不再压缩
function f_common() {
    let f = filter(['**/*.js', '!**/*.min.js'], {
        restore: true
    });
    return gulp.src(paths.common + '/**/*.js')
        .pipe(f)
        .pipe(gulpif(release, uglify()))
        .pipe(f.restore)
        .pipe(gulp.dest(paths.staticCommon));
}
//压缩图片
function f_imgMin() {
    return gulp.src(paths.img + '/**/*.{png,jpg,gif,ico,svg}')
        .pipe(cache(imagemin({ //缓存图片
            optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()] //深度压缩
        })))
        .pipe(gulp.dest(paths.staticImg));
}

//合并，压缩SVG
function f_svgsprite() {
    return gulp.src(paths.svg + '/**/*.svg')
        .pipe(plumber())
        .pipe(rename({
            prefix: 'icon-'
        }))
        .pipe(through2.obj(function (file, enc, cb) {
            console.log(file.path);
            this.push(file);
            cb();
        }))
        .pipe(cache(svgmin({
            plugins: [{
                    removeTitle: true
                },
                {
                    removeDesc: true
                },
                {
                    removeUselessDefs: true
                },
                {
                    removeUnknownsAndDefaults: true
                },
                {
                    removeUselessStrokeAndFill: true
                },
                {
                    convertTransform: true
                },
                {
                    mergePaths: true
                },
                {
                    convertPathData: false
                },
                {
                    convertShapeToPath: true
                },
                {
                    removeStyleElement: true
                },
                {
                    removeAttrs: {
                        attrs: "(class|style|fill|data-.*)"
                    }
                }
            ]
        })))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(gulp.dest(paths.staticSvg));
}

//压缩html
function f_htmlMin() {
    return gulp.src(paths.app + '/**/*.html')
        .pipe(gulpif(release, htmlmin({
            removeComments: true, //清除HTML注释
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        })))
        .pipe(gulp.dest(paths.static));
}


//编译sass
gulp.task('sass', f_sass);

//编译js
gulp.task('js', f_js);

//复制工具类JS,原本就压缩过的文件不再压缩
gulp.task('copy:common', f_common);

//编译并压缩js
gulp.task('jsmin', ['js'], f_jsmin);

//压缩图片
gulp.task('imgMin', f_imgMin);

//合并，压缩SVG
gulp.task("svgsprite", f_svgsprite);

//压缩html
gulp.task('htmlMin', f_htmlMin);

//启动项目
gulp.task('default', () => {
    release = false;
    // start server
    browserSyncCreate.init({
        ui: false,
        notify: false,
        port: 5679,
        // 设置代理请求
        proxy: false,
        server: {
            baseDir: paths.static
        }
    });
    //sass文件监听
    let cssPath = paths.css + '/**/*.scss';
    gulp.src(cssPath)
        .pipe(watch(cssPath, f_sass));
    //js文件监听
    let jsPath = paths.js + '/**/*.js';
    gulp.src(jsPath)
        .pipe(watch(jsPath, f_js));
    //common js文件监听
    let commonPath = paths.common + '/**/*.js';
    gulp.src(commonPath)
        .pipe(watch(commonPath, f_common));
    //img文件监听
    let imgPath = paths.img + '/**/*.{png,jpg,gif,ico,svg}';
    gulp.src(imgPath)
        .pipe(watch(imgPath, f_imgMin));
    //svg文件监听
    let svgPath = paths.svg + '/**/*.svg';
    gulp.src(svgPath)
        .pipe(watch(svgPath, f_svgsprite));
    //html文件监听
    let htmlPath = paths.app + '/**/*.html';
    gulp.src(htmlPath)
        .pipe(watch(htmlPath, f_htmlMin));

    // 监听刷新
    reloadBrowser();
});

//清除缓存
gulp.task('clean:cache', () =>
    cache.clearAll()
);

//清空打包目录
gulp.task('clean:dist', () => del(paths.dist, {
    force: true
}));

//清空编译过后目录
gulp.task('clean:static', () => del(paths.static, {
    force: true
}));


//复制打包目录
gulp.task("copy:dist", () => gulp.src([paths.static + '/**/*',
        '!' + paths.static + '/**/*.scss'
    ])
    .pipe(gulp.dest(path.join(paths.dist, 'static')))
);

//压缩打包
gulp.task('release', (cb) => {
    release = true;
    sequence(['clean:dist', 'clean:static', 'clean:cache'], ['htmlMin', 'jsmin', 'copy:common', 'sass', 'svgsprite', 'imgMin'], ['copy:common', 'copy:dist'], cb);
});