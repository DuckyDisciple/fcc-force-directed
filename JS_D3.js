var url = "https://www.freecodecamp.com/news/hot";

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
    var users = [];
    var domains = [];
    data.map(function(post){
      var userFound=false;
      for(var i=0; i<users.length; i++){
        if(users[i].userId === post.author.userId){
          userFound=true;
          break;
        }
      }
      if(!userFound){
        users.push(post.author);
      }
      var domainFound = -1;
      var domString = getDomain(post.link);
      for(var i=0; i<domains.length; i++){
        
        if(domains[i].url === domString){
          domainFound = i;
          break;
        }
      }
      if(domainFound>-1){
        domains[i].count++;
      }else{
        domains.push({url:domString,count:1});
      }
    });
    
    d3.select("body").append("h2").text("domains");
    d3.select("body").selectAll(".dom").data(domains).enter()
      .append("p").classed("dom",true).text(function(d){return d.url});
    d3.select("body").append("h2").text("users");
    d3.select("body").selectAll(".usr").data(users).enter()
      .append("p").classed("usr",true).text(function(d){return d.username});
  });
});
