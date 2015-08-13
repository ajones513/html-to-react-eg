var React = require('react');
var HtmlToReact = new require('html-to-react');

var htmlInput = '<div><h1>Title</h1><p>Paragraph</p><h1>Another title</h1><MyComponent someProp="PROPS TO YOU!"></MyComponent</div>';
var htmlExpected = '<div><h1>TITLE</h1><p>Paragraph</p><h1>ANOTHER TITLE</h1><abbr>MY COMPONENT PROPS TO YOU!</abbr></div>';

var MyComponent = React.createClass({
    render: function() {
        return React.createElement("abbr", null, "MY COMPONENT ", this.props.someProp);
    }
});

var isValidNode = function() {
    return true;
};

// Order matters. Instructions are processed in the order they're defined
var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
var processingInstructions = [
    {
        // Custom <h1> processing
        shouldProcessNode: function(node) {
            return node.parent && node.parent.name && node.parent.name === 'h1';
        },
        processNode: function(node, children) {
            return node.data.toUpperCase();
        }
    },
    {
        shouldProcessNode: function(node) {
            return node && node.name === 'mycomponent';
        },
        processNode: function(node, children) {
            return React.createElement(MyComponent, {someProp: node.attribs.someprop});
        }
    },
    {
        // Anything else
        shouldProcessNode: function(node, children) {
            return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
    }];
var htmlToReactParser = new HtmlToReact.Parser(React);
var reactComponent = htmlToReactParser.parseWithInstructions(htmlInput, isValidNode, processingInstructions);
var reactHtml = React.renderToStaticMarkup(reactComponent);

console.log(reactHtml);
console.log(reactHtml === htmlExpected);
