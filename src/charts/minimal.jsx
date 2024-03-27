import * as go from 'gojs'

export const init = () => {
  const myDiagram =
    new go.Diagram("chart",  // create a Diagram for the HTML Div element
      { "undoManager.isEnabled": true });  // enable undo & redo

  // define a simple Node template
  myDiagram.nodeTemplate =
    new go.Node("Auto")  // the Shape will go around the TextBlock
      .add(new go.Shape("RoundedRectangle",
        { strokeWidth: 0, fill: "white" })  // no border; default fill is white
        .bind("fill", "color"))  // Shape.fill is bound to Node.data.color
      .add(new go.TextBlock(
        { margin: 8, font: "bold 14px sans-serif", stroke: '#333' })  // some room around the text
        .bind("text", "key"));  // TextBlock.text is bound to Node.data.key

  // but use the default Link template, by not setting Diagram.linkTemplate

  // create the model data that will be represented by Nodes and Links
  myDiagram.model = new go.GraphLinksModel(
    [
      { key: "Alpha", color: "lightblue" },
      { key: "Beta", color: "orange" },
      { key: "Gamma", color: "lightgreen" },
      { key: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);


  return myDiagram
}