var getGrade = function(quiz){
    return (quiz.grade/quiz.max)*100;}
var quizArrayofOnePenguin = function(student){
    return student.quizes.map(getGrade)
}   

var newArray = function(student){
    dataSet={
        picture: student.picture,
        quizes: quizArrayofOnePenguin(student)
    }
    return dataSet
}
var completeArray = function(students){
    return students.map(newArray)
}



var drawLines =function(students,graph,target,xScale,yScale)
{
    console.log(students,"data")
    var lineGenerator = d3.line()
        .x(function(quizes,i){
              
                return xScale(i).toFixed(2);})
        .y(function(quizes){
               
                return yScale(quizes).toFixed(2);})
        .curve(d3.curveCardinal);
    
    var lines =d3.select(target)
                .select(".graph")
                .selectAll("g")
                .data(students)
                .enter()
                .append("g")
                .classed("line",true)
                .attr("fill","none")
                .attr("stroke",function(student){
                    mean=d3.mean(student.quizes)
                    if (mean>69){
                        return "green"
                    }
                    else{
                        return "red"
                    }
                })
                .attr("stroke-width",5)
                .on("mouseover",function(student)
        {   
            if(! d3.select(this).classed("off"))
            {
            d3.selectAll(".line")
            .classed("fade",true);
            
            d3.select(this)
                .classed("fade",false)
                .raise(); //move to top
            }
            console.log("tooltip #data")
                       
                       
                       

                        
                     
                        var xPosition = d3.event.pageX;
                        var yPosition = d3.event.pageY;
                        d3.select("#tooltip")
                            .style("left",xPosition + "px")
                            .style("top",yPosition +"px")
                            .select("#value")
                            .text(d3.mean(student.quizes).toFixed(2))
                   
                            .append("img")
                            .attr("id","data")
                            .attr("src", "imgs/" + student.picture)
                    
                            
                            
                            
                        d3.select("#tooltip").classed("hidden",false);
            
        })
            .on("mouseout",function(student)
           {
            if(! d3.select(this).classed("off"))
            {
            
            d3.selectAll(".line")
                .classed("fade",false);
            }
                 d3.select("#tooltip #data")
                            .remove();
             d3.select("#tooltip").classed("hidden",true)
        })
    
    
    lines.append("path")
        .datum(function(student){return student.quizes;})
        .attr("d",lineGenerator)
    
    
}


var createLabels = function(screen,margins,graph,target)
{
        var labels = d3.select(target)
        .append("g")
        .classed("labels",true)
        
    labels.append("text")
        .text("Penguins Quiz Grades")
        .classed("title",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",margins.top-90)
    
    labels.append("text")
        .text("Quizes")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graph.width/2))
        .attr("y",screen.height-10)
    
    labels.append("g")
        .attr("transform","translate(10,"+ 
              (margins.top+(graph.height/2))+")")
        .append("text")
        .text("Quiz Grades")
        .classed("label",true)
        .attr("text-anchor","middle")
        .attr("transform","rotate(90)")
    
}
var createAxes = function(screen,margins,graph,target,xScale,yScale)
{
    
  var xAxis = d3.axisBottom(xScale);
  
  var yAxis = d3.axisLeft(yScale);
    
  var axes = d3.select(target)
        .append("g")
  axes.append("g")
       .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
  axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)  
    
    
}
var initGraph = function(target,students)
{
      //the size of the screen
    var screen = {width:1100, height:1100};
    
    //how much space will be on each side of the graph
    var margins = {top:150,bottom:50,left:50,right:50};
//    
//    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    };
    
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    var g=d3.select(target)
            .append("g")
            .classed("graph",true)
            .attr("transform","translate("+margins.left+","+
             (margins.top)+")");
    var num = students[0].quizes.length-1
    console.log(num)
    var maxofAllPenguins = function(students){
        return d3.max(students.map(function(student){return d3.max(student.quizes)}))
    };
    var xScale = d3.scaleLinear()
        .domain([0,num])
        .range([0,graph.width]);
    var yScale = d3.scaleLinear()
        .domain([0,maxofAllPenguins(students)])
        .range([graph.height,0]); 
    console.log(maxofAllPenguins(students))
    createLabels(screen,margins,graph,target);
    createAxes(screen,margins,graph,target,xScale,yScale);
    drawLines(students,graph,target,xScale,yScale)
    
    
    
}





var penguinPromise = d3.json("classData.json");

var sucessFCN = function(students){
 console.log("Data Collected", students);
 var updatedStudents=completeArray(students);
 initGraph("#QuizGrades",updatedStudents)


}

var failFCN = function(errorMsg)
                {
                    console.log("Something went wrong", errorMsg);
                  
                };
penguinPromise.then(sucessFCN,failFCN);
