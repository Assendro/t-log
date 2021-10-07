
let project_folder = "main";
let source_folder = "dev";

let path = {
    build: {
        pug: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/"
    },
    dev: {
        pug: source_folder + "/*.pug",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf"
    },
    watch: {
        pug: source_folder + "/**/*.pug",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    del = require("del"),
    gulp_pug = require('gulp-pug'),
    scss = require('gulp-sass')(require('sass')),
    autoprefixer = require('gulp-autoprefixer'),
    clean_css = require('gulp-clean-css'),
    uglify = require('gulp-uglify-es').default,
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2');


function fonts(params) {
    src(path.dev.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))
    return src(path.dev.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))
}
function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function pug() {
    return src(path.dev.pug)
        .pipe(gulp_pug())
        .pipe(dest(path.build.pug))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.dev.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true
            })
        )
        .pipe(clean_css())
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.dev.js)
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(browsersync.stream())
}

function images() {
    return src(path.dev.img)
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles(params) {
    gulp.watch([path.watch.pug], pug);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);

}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, pug, images, fonts));
let watch = gulp.parallel(browserSync, watchFiles, build);


exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.pug = pug;
exports.build = build;
exports.watch = watch;
exports.default = watch;