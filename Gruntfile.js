/*global module */
/*global require */
(function () {
  'use strict';
  module.exports = function (grunt) {
    // Apparently I have to require mozjpeg anyways
    // need to research why. Is it because it's not
    // seen as a grunt package?
    var mozjpeg = require('imagemin-mozjpeg');
    // require time-grunt at the top and pass in the grunt instance
    // it will measure how long things take for performance
    //testing
    require('time-grunt')(grunt);

    // load-grunt will read the package file and automatically
    // load all our packages configured there.
    // Yay for laziness
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

      // JAVASCRIPT TASKS
      // Hint the grunt file and all files under js/
      // and one directory below
      jshint: {
        files: [ 'Gruntfile.js', 'js/{,*/}*.js'],
        options: {
          reporter: require('jshint-stylish')
          // options here to override JSHint defaults
        }
      },

      // SASS RELATED TASKS
      // Converts all the files under scss/ ending with .scss
      // into the equivalent css file on the css/ directory
      sass: {
        dev: {
          options: {
            style: 'expanded'
          },
          files: [ {
            expand: true,
            cwd: 'sass',
            src: [ '*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        },
        production: {
          options: {
            style: 'compact'
          },
          files: [ {
            expand: true,
            cwd: 'sass',
            src: [ '**/*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        }
      },

      // This task requires the scss-lint ruby gem to be
      // installed on your system If you choose not to
      // install it, comment out this task and the prep-css
      // and work-lint tasks below
      //
      // I've chosen not to fail on errors or warnings.
      scsslint: {
        allFiles: [ 'scss/**/*.scss' ],
        options: {
          force: true,
          colorizeOutput: true
        }
      },

      imagemin: {
        png: {
          options: {
            optimizationLevel: 3
          },
          files: [
            {
              // Set to true to enable the following options…
              expand: true,
              // cwd is 'current working directory'
              cwd: 'images/',
              src: ['**/*.png'],
              // Could also match cwd line above. i.e. project-directory/img/
              dest: 'dist/images/',
              ext: '.png'
            }
          ]
        },
        jpg: {
          options: {
            progressive: true,
            use: [mozjpeg()]
          },
          files: [
            {
              // Set to true to enable the following options…
              expand: true,
              // cwd is 'current working directory'
              cwd: 'images/',
              src: ['**/*.jpg'],
              // Could also match cwd. i.e. project-directory/img/
              dest: 'dist/images/',
              ext: '.jpg'
            }
          ]
        }
      },

      // Autoprefixer will check caniuse.com's database and
      // add the necessary prefixes to CSS elements as needed.
      // This saves us from doing the work manually
      autoprefixer: {
        options: {
          browsers: [ 'last 2 versions', 'ie8', 'ie9' ]
        },

        files: {
          expand: true,
          flatten: true,
          src: 'css/*.css',
          dest: 'css/*.css'
        }
      },
      
      combine_mq: {
        new_filename: {
          options: {
            beautify: true
          },
          src: 'css/**/*.css',
          dest: 'css/mediaqueries.css'
        }
      },
      
      csso: {
        dynamic_mappings: {
          expand: true,
          cwd: '/css/',
          src: ['**/*.css', '!**/*.min.css'],
          dest: '/css/',
          ext: '.min.css'
        }
      },
      
      cssshrink: {
        options: {
          log: true
        },
        main: {
          files: {
            'css': ['**/*.css']
          }
        }
      },

      // UNCSS will analyzes the your HTML pages and
      // remove from the CSS all the classes that are
      // not used in any of your HTML pages
      //
      // This task needs to be run in the processed CSS
      // rather than the SCSS files
      //
      //See https://github.com/addyosmani/grunt-uncss
      // for more information
      uncss: {
        dist: {
          files: {
            'dist/css/main.css': [ 'dist/*.html' ]
          }
        }
      }
    });
    // closes initConfig

    // CUSTOM TASKS
    // Usually a combination of one or more tasks defined above

    grunt.task.registerTask(
      'lint',
      [ 'scsslint']
    );

    // Prep CSS starting with linting SASS, converting SASS to CSS and processing the 
    // CSS with autoprefixer
    grunt.task.registerTask(
      'prep-scss',
      [ 'scsslint', 'sass:dev', 'autoprefixer' ]
    );
    
    grunt.task.registerTask(
      'process-css',
      [   ]
    );

  };
  // closes module.exports
}
());
// closes the use strict function
