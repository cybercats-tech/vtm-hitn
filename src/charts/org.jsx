import * as go from "gojs";

go.Shape.defineFigureGenerator("RoundedTopRectangle", (shape, w, h) => {
  // this figure takes one parameter, the size of the corner
  var p1 = 5;  // default corner size
  if (shape !== null) {
    var param1 = shape.parameter1;
    if (!isNaN(param1) && param1 >= 0) p1 = param1;  // can't be negative or NaN
  }
  p1 = Math.min(p1, w / 2);
  p1 = Math.min(p1, h / 2);  // limit by whole height or by half height?
  var geo = new go.Geometry();
  // a single figure consisting of straight lines and quarter-circle arcs
  geo.add(new go.PathFigure(0, p1)
    .add(new go.PathSegment(go.PathSegment.Arc, 180, 90, p1, p1, p1, p1))
    .add(new go.PathSegment(go.PathSegment.Line, w - p1, 0))
    .add(new go.PathSegment(go.PathSegment.Arc, 270, 90, w - p1, p1, p1, p1))
    .add(new go.PathSegment(go.PathSegment.Line, w, h))
    .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
  // don't intersect with two top corners when used in an "Auto" Panel
  geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0.3 * p1);
  geo.spot2 = new go.Spot(1, 1, -0.3 * p1, 0);
  return geo;
});

const iconMap = new Map()
iconMap.set('Brujah', 'https://vtm.paradoxwikis.com/images/thumb/8/87/Brujah_symbol.png/1024px-Brujah_symbol.png')
iconMap.set('Gangrel', 'https://vtm.paradoxwikis.com/images/thumb/e/e4/Gangrel_symbol.png/240px-Gangrel_symbol.png')
iconMap.set('Malkavian', 'https://vtm.paradoxwikis.com/images/thumb/1/1f/Malkavian_symbol.png/240px-Malkavian_symbol.png')
iconMap.set('Nosferatu', 'https://vtm.paradoxwikis.com/images/thumb/6/61/Nosferatu_symbol.png/240px-Nosferatu_symbol.png')
iconMap.set('Toreador', 'https://vtm.paradoxwikis.com/images/thumb/2/28/Toreador_symbol.png/240px-Toreador_symbol.png')
iconMap.set('Tremere', 'https://vtm.paradoxwikis.com/images/thumb/e/ef/Tremere_symbol.png/240px-Tremere_symbol.png')
iconMap.set('Ventrue', 'https://vtm.paradoxwikis.com/images/thumb/f/fa/Ventrue_symbol.png/240px-Ventrue_symbol.png')
iconMap.set('Lasombra', 'https://vtm.paradoxwikis.com/images/thumb/0/0b/Lasombra_symbol.png/240px-Lasombra_symbol.png')

export function init(data) {
  let myDiagram;

  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make; // for conciseness in defining templates

  // some constants that will be reused within templates
  // var mt8 = new go.Margin(8, 0, 0, 0);
  // var mr8 = new go.Margin(0, 8, 0, 0);
  // var ml8 = new go.Margin(0, 0, 0, 8);
  // var roundedRectangleParams = {
  //   parameter1: 10, // set the rounded corner
  //   spot1: go.Spot.TopLeft,
  //   spot2: go.Spot.BottomRight, // make content go all the way to inside edges of rounded corners
  // };

  myDiagram = new go.Diagram(
    "diagram", // the DIV HTML element
    {
      // Put the diagram contents at the top center of the viewport
      initialDocumentSpot: go.Spot.Top,
      initialViewportSpot: go.Spot.Top,
      // OR: Scroll to show a particular node, once the layout has determined where that node is
      // "InitialLayoutCompleted": e => {
      //  var node = e.diagram.findNodeForKey(28);
      //  if (node !== null) e.diagram.commandHandler.scrollToPart(node);
      // },
      layout: $(
        go.TreeLayout, // use a TreeLayout to position all of the nodes
        {
          // isOngoing: false, // don't relayout when expanding/collapsing panels
          treeStyle: go.TreeLayout.AlignmentStart,
          // properties for most of the tree:
          angle: 90,
          // layerSpacing: 80,
          // properties for the "last parents":
          // alternateAngle: 0,
          // alternateAlignment: go.TreeLayout.AlignmentStart,
          // alternateNodeIndent: 15,
          // alternateNodeIndentPastParent: 1,
          // alternateNodeSpacing: 15,
          // alternateLayerSpacing: 40,
          // alternateLayerSpacingParentOverlap: 1,
          // alternatePortSpot: new go.Spot(0.001, 1, 20, 0),
          // alternateChildPortSpot: go.Spot.Left,
        }
      ),
    }
  );

  // define the Node template
  const npcTemplate = $(
    go.Node,
    "Vertical",
    $(go.Panel, "Position",
      { background: "transparent" },
      $(go.Shape, "RoundedTopRectangle", { parameter1: 50, width: 320, height: 360, fill: '#9b9c97' }),
      $(go.Picture,
        {
          position: new go.Point(150, 10),
          width: 40, height: 40
        },
        new go.Binding("source", 'clan', clan => iconMap.get(clan)),
        new go.Binding("visible", 'clan', clan => iconMap.has(clan)),
      ),
      $(go.TextBlock,
        {
          position: new go.Point(0, 60), 
          font: "Bold 24pt Cormorant Garamond", width: 320, textAlign: 'center' 
        },
        new go.Binding("text", "name")
      ),
      $(go.Picture,
        {
          position: new go.Point(55, 110),
          width: 220, height: 200
        },
        new go.Binding("source", "portrait"),
        new go.Binding("visible", 'portrait', (val) => val !== undefined),
      ),
      $(go.TextBlock,
        {
          position: new go.Point(0, 320), 
          font: "Bold 18pt Cormorant Garamond", width: 320, textAlign: 'center' 
        },
        new go.Binding("text", "status")
      ),
    ),
  );

  const pcTemplate = $(
    go.Node,
    "Vertical",
    $(go.Panel, "Position",
      { background: "transparent" },
      $(go.Shape, "RoundedTopRectangle", { parameter1: 50, width: 320, height: 360, fill: '#9b9c97' }),
      $(go.Picture,
        {
          position: new go.Point(150, 10),
          width: 40, height: 40
        },
        new go.Binding("source", 'clan', clan => iconMap.get(clan)),
        new go.Binding("visible", 'clan', clan => iconMap.has(clan)),
      ),
      $(go.TextBlock,
        {
          position: new go.Point(0, 60), 
          font: "Bold 24pt Cormorant Garamond", width: 320, textAlign: 'center' 
        },
        new go.Binding("text", "name")
      ),
      $(go.Picture,
        {
          position: new go.Point(55, 110),
          width: 220, height: 200,
          click: function(e, obj) {
            console.log(obj.part.data);
            const link = obj.part.data.telegram

            if(link && window.open) window.open(link, '_blank')
          }
        },
        new go.Binding("source", "portrait"),
        new go.Binding("visible", 'portrait', (val) => val !== undefined),
      ),
      $(go.TextBlock,
        {
          position: new go.Point(0, 320), 
          font: "Bold 18pt Cormorant Garamond", width: 320, textAlign: 'center' 
        },
        new go.Binding("text", "status")
      )
    ),
  );

  const organizationNodeTemplate = $(go.Node, "Auto",
    $(go.Picture,
      { margin: 5, width: 320, height: 180 },
      new go.Binding("source", "image"))
  );

  // define the Link template, a simple orthogonal line
  myDiagram.linkTemplate = $(
    go.Link,
    go.Link.Orthogonal,
    { corner: 5, selectable: false },
    $(go.Shape, { strokeWidth: 3, stroke: "#424242" })
  ); // dark gray, rounded corner links


  myDiagram.groupTemplate =
    $(go.Group, "Vertical",
      $(go.Panel, "Auto",
        $(go.Shape, "RoundedRectangle",  // surrounds the Placeholder
          {
            parameter1: 14,
            fill: "rgba(128,128,128,0.33)"
          }),
        $(go.Placeholder,    // represents the area of all member parts,
          { padding: 5 })  // with some extra padding around them
      ),
      $(go.TextBlock,         // group title
        { alignment: go.Spot.Right, font: "Bold 12pt Sans-Serif" },
        new go.Binding("text", "key"))
    );

  const templmap = new go.Map(); // In TypeScript you could write: new go.Map<string, go.Node>();
  templmap.add("npc", npcTemplate);
  templmap.add("pc", pcTemplate);
  templmap.add("organization", organizationNodeTemplate);

  myDiagram.nodeTemplateMap = templmap;


  // create the Model with data for the tree, and assign to the Diagram
  myDiagram.model = new go.TreeModel({
    nodeDataArray: data,
  });

  // Overview
  new go.Overview(
    "map", // the HTML DIV element for the Overview
    { observed: myDiagram, contentAlignment: go.Spot.Center }
  ); // tell it which Diagram to show and pan

  return myDiagram;
}

// the Search functionality highlights all of the nodes that have at least one data property match a RegExp
// function searchDiagram() {
//   // called by button
//   var input = document.getElementById("mySearch");
//   if (!input) return;
//   myDiagram.focus();

//   myDiagram.startTransaction("highlight search");

//   if (input.value) {
//     // search four different data properties for the string, any of which may match for success
//     // create a case insensitive RegExp from what the user typed
//     var safe = input.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//     var regex = new RegExp(safe, "i");
//     var results = myDiagram.findNodesByExample(
//       { name: regex },
//       { nation: regex },
//       { title: regex },
//       { headOf: regex }
//     );
//     myDiagram.highlightCollection(results);
//     // try to center the diagram at the first node that was found
//     if (results.count > 0) myDiagram.centerRect(results.first().actualBounds);
//   } else {
//     // empty string only clears highlighteds collection
//     myDiagram.clearHighlighteds();
//   }

//   myDiagram.commitTransaction("highlight search");
// }

// window.addEventListener('DOMContentLoaded', init);
