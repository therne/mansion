
var fs = require('fs');
var path = require('path');
var htmlCache = new Map();

exports.notFound = function(ctx) {
    if (ctx.accepts('html')) {
        ctx.response.type = 'html';
        return load('not-found');
    }
    return { code: 404, message: 'Not Found' };
};

exports.error = function(ctx, err) {
    if (ctx.accepts('html')) {
        ctx.response.type = 'html';

        if (ctx.__debug) {
            return load('error')
                    .replace(/<%= name %>/g, err.name)
                    .replace(/<%= message %>/g, err.message)
                    .replace(/<%= stack %>/g, htmlStack(err.stack));
        }
        return load('internal');
    }

    // json
    if (ctx.__debug) {
        return {
            error: {
                name: err.name,
                message: err.message,
                stack: prettyStack(err.stack)
            },
            code: 500,
            message: 'Internal Server Error'
        }
    }
    return { code: 500, message: 'Internal Server Error' }
};

function load(templateName) {
    var template = htmlCache.get('templateName');
    if (!template) {
        template = fs.readFileSync(__dirname + '/../../templates/'+templateName+'.html').toString();
        htmlCache.set(templateName, template);
    }
    return template;
}

function prettyStack(stack) {
    // TODO: relative path
    return stack;
}

function htmlStack(stack) {
    stack = prettyStack(stack);

    stack = stack.substring(stack.indexOf('\n')+1);
    stack = stack.replace(/\<anonymous\>/g, '&lt;anonymous&gt;')

    // path comprehension
    stack = stack.replace(/(\/[\w\/\.]+\/)([\w\/\.]+)/g, '<a href="javascript:alert(\'$1$2\');">$2</a>');
    return stack.replace(/  /g, '');
}