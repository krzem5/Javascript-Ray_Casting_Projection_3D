var cnv,ctx,lines=[],particles=[],FISH_EYE=false
function init(){
	cnv=document.getElementsByClassName("cnv")[0]
	ctx=cnv.getContext("2d")
	create_lines()
	requestAnimationFrame(render)
}
function render(){
	ctx.clearRect(0,0,cnv.width,cnv.height)
	ctx.fillStyle="#000000"
	ctx.fillRect(0,0,cnv.width,cnv.height)
	for (var l of lines){
		l.draw()
	}
	for (var p of particles){
		p.draw()
	}
	draw_cam_view()
	requestAnimationFrame(render)
}
function draw_cam_view(){
	if (particles.length==0){return}
	function map(v,aa,ab,ba,bb){
		return Math.min(Math.max((v-aa)/(ab-aa)*(bb-ba)+ba,Math.min(ba,bb)),Math.max(ba,bb))
	}
	ctx.fillStyle="#000000"
	ctx.fillRect(cnv.width/2,0,cnv.width/2,cnv.height)
	var P=particles[0]
	var rw=cnv.width/2/P.rays.length
	var i=0
	var MAX_VIEW=cnv.width/3
	for (var ri=0;ri<P.rays.length;ri++){
		var r=P.rays[ri]
		var d=Math.abs(Math.sqrt((r.end.x-r.pos.x)*(r.end.x-r.pos.x)+(r.end.y-r.pos.y)*(r.end.y-r.pos.y))*(FISH_EYE==true?1:Math.cos(r.a)))
		var b=Math.floor(map(d*d,0,MAX_VIEW*MAX_VIEW,255,0)).toString(16)
		if (b.length==1){b="0"+b}
		var h=map(d,0,MAX_VIEW,cnv.height,0)
		ctx.fillStyle="#"+b+b+b
		ctx.fillRect(cnv.width/2+i*rw,cnv.height/2-h/2,rw+1,h)
		i++
	}
}
function keydown(e){
	if (lines.length==0){return}
	switch(e.keyCode){
		case 87:
			particles[0].update(1,0,0)
			break
		case 65:
			particles[0].update(0,-1,0)
			break
		case 83:
			particles[0].update(-1,0,0)
			break
		case 68:
			particles[0].update(0,1,0)
			break
		case 81:
			particles[0].update(0,0,-1)
			break
		case 69:
			particles[0].update(0,0,1)
			break
		case 32:
			FISH_EYE=!FISH_EYE
			break
	}
}
function create_lines(){
	fetch("./data/board.txt").then((r)=>r.text()).then(function(b){
		b=b.split("\n")
		w=b[0].split(" ")[0]
		h=b[0].split(" ")[1]
		CW=50
		CH=50
		cnv.width=CW*w*2
		cnv.height=CH*h
		lines.push(new Line(0,0,cnv.width/2,0))
		lines.push(new Line(cnv.width/2,0,cnv.width/2,cnv.height))
		lines.push(new Line(cnv.width/2,cnv.height,0,cnv.height))
		lines.push(new Line(0,cnv.height,0,0))
		var x=0,y=0
		for (var l of b.slice(1)){
			for (var c of l.split(",")){
				if (c.includes("1")){
					lines.push(new Line(x*CW,y*CH,(x+1)*CW,y*CH))
				}
				if (c.includes("2")){
					lines.push(new Line((x+1)*CW,y*CH,(x+1)*CW,(y+1)*CH))
				}
				if (c.includes("3")){
					lines.push(new Line((x+1)*CW,(y+1)*CH,x*CW,(y+1)*CH))
				}
				if (c.includes("4")){
					lines.push(new Line(x*CW,(y+1)*CH,x*CW,y*CH))
				}
				x++
			}
			x=0
			y++
		}
		particles.push(new Particle(cnv.width/4,cnv.height/2))
	})
}
document.addEventListener("DOMContentLoaded",init,false)
document.addEventListener("keydown",keydown,false)