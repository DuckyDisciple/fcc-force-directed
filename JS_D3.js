var url = "https://www.freecodecamp.com/news/hot";

var w = 850;
var h = 550;

function getDomain(link){
  if(link.indexOf('://') > -1){
    link = link.split("/")[2];
  }else{
    link = link.split("/")[0];
  }
  if((link.match(/\./g)||[]).length>1){
    link = link.substr(link.indexOf(".")+1);
  }
  return link;
}

$(document).ready(function(){
  $.get(url,function(data){
    var nodes = [];
    var links = [];
    var users = [];
    var domains = [];
    data.map(function(post){
      var userIndex=-1;
      var domainIndex = -1;
      var domString = getDomain(post.link);
      for(var i=0; i<nodes.length; i++){
        if(nodes[i].id === post.author.userId){
          userIndex=i;
        }
        if(nodes[i].url === domString){
          domainIndex = i;
        }
      }
      if(userIndex===-1){
        nodes.push({type:"user",
                    name:post.author.username,
                    pic:post.author.picture,
                    id:post.author.userId});
        userIndex = nodes.length-1;
      }
      if(domainIndex>-1){
        nodes[domainIndex].count++;
      }else{
        nodes.push({type:"domain",
                    url:domString,
                    count:1});
        domainIndex = nodes.length-1;
      }
      links.push({source:userIndex,target:domainIndex,weight:1});
    });
    
    var force = d3.layout.force()
      .charge(-120)
      .linkDistance(50)
      .nodes(nodes)
      .links(links)
      .size([w,h])
      .start();
    
    var svg = d3.select("body")
      .append("svg")
      .attr("width",w)
      .attr("height",h);
    
    var link = svg.selectAll(".link")
      .data(links)
      .enter()
     .append("line")
      .classed("line",true)
      .style("stroke-width",2);
    
    var node = svg.selectAll(".node")
      .data(nodes)
      .enter()
     .append("g")
      .classed("node",true)
      .classed("user",function(d){return d.type==="user"})
      .classed("domain",function(d){return d.type==="domain"})
      .attr("x",function(d){return d.x;})
      .attr("y",function(d){return d.y;})
      .call(force.drag);
    
    svg.selectAll(".domain").append("circle")
      .attr("r",function(d){return 5+d.count})
      
    
    svg.selectAll(".user")
      .append("svg:image")
      .attr("width", 40)
      .attr("height", 40)
      .attr("transform","translate(-20,-20)")
      .attr("xlink:href",function(d){return d.pic});
    
    force.on("tick",function(){
      link.attr("x1",function(d){return d.source.x})
        .attr("y1",function(d){return d.source.y})
        .attr("x2",function(d){return d.target.x})
        .attr("y2",function(d){return d.target.y});
      node.attr("cx",function(d){return d.x})
        .attr("cy",function(d){return d.y});
      svg.selectAll(".node").attr("transform",function(d){return "translate("+d.x+","+d.y+")"});
    })
  });
});
