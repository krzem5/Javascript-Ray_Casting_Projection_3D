class Particle{
	constructor(x,y){
		this.pos={x,y}
		this.rays=null
		this.FOV=60
		this.a=0
		this.update(0,0,0)
	}
	gen_rays(){
		var rs=[]
		for (var a=0;a<this.FOV/(180/Math.PI);a+=Math.PI*2/1000){
			rs.push(new Ray(this.pos.x,this.pos.y,a-this.FOV/(180/Math.PI)/2))
		}
		return rs
	}
	update(x,y,a){
		x*=2
		y*=2
		a*=0.1
		this.a+=a
		this.pos.x=Math.min(Math.max(this.pos.x+Math.sqrt(x*x+y*y)*Math.cos(Math.atan2(y,x)+this.a),0),cnv.width/2)
		this.pos.y=Math.min(Math.max(this.pos.y+Math.sqrt(x*x+y*y)*Math.sin(Math.atan2(y,x)+this.a),0),cnv.height)
		if (this.rays==null){
			this.rays=this.gen_rays()
		}
		var i=0
		for (var a=0;a<this.FOV/(180/Math.PI);a+=Math.PI*2/1000){
			this.rays[i].pos={x:this.pos.x,y:this.pos.y}
			this.rays[i].calc_end(this.a+a-this.FOV/(180/Math.PI)/2)
			this.rays[i].update()
			i++
		}
	}
	draw(){
		if (this.rays==null){
			return
		}
		for (var r of this.rays){
			r.draw()
		}
		ctx.beginPath()
		ctx.fillStyle="#a020b0"
		ctx.arc(this.pos.x,this.pos.y,5,0,Math.PI*2)
		ctx.fill()
	}
}