		var left = document.getElementById('left');
		var back = document.getElementById('back');
		var slide = document.getElementById('slide'); 
		var right = 0;

			left.onclick = function sliderLeft(){
				right = right - 768;
				if (right < -2304) {
					right = -2304;
				}
				slide.style.left = right+"px";
			};

			back.onclick = function(){
				right = right +768; 
				if (right > 0) {
					right = 0;
				}
				slide.style.left = right+"px";
			};