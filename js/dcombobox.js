(function($){
			
			function getTree(data,result){
					for (var i=0 ; i< data.length;i++)
					{
	
						
						if(data[i].childs.length>0){
							result.data +='<li value="'+data[i].id+'"><div class="ui-dcombobox-item-wapper"><input class="ui-dcombobox-hidden-type" type="hidden" value="'+data[i].type+'" /><input class="ui-dcombobox-hidden-name" type="hidden" value="'+data[i].name+'" /><p class="ui-dcombobox-bullet ui-dcombobox-bullet-show ui-dcombobox-border-left"><img src="img/sub.png" alt="Expand" /></p><p class=" ui-dcombobox-item ui-dcombobox-border-right">'+data[i].name+'</p></div>';
							result.data +="<ul>";
							getTree(data[i].childs,result);
						}
						else
						{
							result.data +='<li value="'+data[i].id+'" class=""><div class=""><input class="ui-dcombobox-hidden-type" type="hidden" value="'+data[i].type+'" /><input class="ui-dcombobox-hidden-name" type="hidden" value="'+data[i].name+'" /><p class="ui-dcombobox-item ui-dcombobox-border-all">'+data[i].name+'</p></div>';
							result.data +="</li>";
						}
						
					}
					result.data +="</ul>";
			}
			function searchTree(id,type,data,result){
				
				for (var i=0 ; i< data.length;i++)
				{
					if(data[i].type == type && data[i].id == id)
					{
						result.data =  data[i];
					}
					if(data[i].childs.length>0){
						searchTree(id,type,data[i].childs,result);
					}
				}
			}
			function getItem(item,data){
				var arr = item.split(':');
				var result = {data:''};
				searchTree(arr[0],arr[1],data,result);
				return result.data;
			}
			
			
			function searchTreeByName(name,data,result){
				for (var i=0 ; i< data.length;i++)
				{
					if(data[i].name.indexOf(name)>=0 || data[i].name.toLowerCase().indexOf(name.toLowerCase())>=0)
					{
						result.data.push(data[i]);
					}
					if(data[i].childs.length>0){
						searchTreeByName(name,data[i].childs,result);
					}
				}
			}
			function getItemsByName(name,data){
				var result = {data:[]};
				if(name !=='')
					searchTreeByName(name,data,result);
				return result.data;
			}
			function generateTree(data){
				var result = {
							data:'<ul class="ui-dcombobox-list">'
						};
				getTree(data,result);
				return result.data+'</ul>';
			}
			
			function getPosition( oElement )
			{
				var iReturnValue = {top:0,left:0};
				while( oElement.length > 0 && oElement.get(0).nodeName !== "BODY" ) {
					position = oElement.position();
					iReturnValue.top += position.top;
					iReturnValue.left += position.left;
					oElement = oElement.parent();
				}
				
				return iReturnValue;
			}
			$.widget('ui.DCombobox',{

					options: {
						data:null,		// input data
						showSearch:true,
						altField:null,
						styles:null,
						enableSearch:false,
						slideSpeed:100
					},
					_create: function(){
					var self = this;
					var el = this.element.hide();
					//console.log(el);
					this.options.altField = el;
					var wrapper = this.wapper = $('<div class="ui-dcombobox-inut-wrapper"></div>').insertAfter(el);
					wrapper.append($('<input class="ui-dcombobox-input">'));
					var input = this.input = $('.ui-dcombobox-input',wrapper);
					var arrow = this.arrow = $('<div class="ui-dcombobox-arrow ui-dcombobox-border-right"></div>').insertAfter(input);
					
					
					// kiem tra xem co duoc search hay ko
					if(!this.options.enableSearch)
						input.attr("readonly","readonly");
					else
					{
						input.keyup(function(){
							var result = getItemsByName($(this).val(),self.options.data);
							$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-no-result");
							$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-result");
							for(i=0; i<result.length;i++){
								
								$('.ui-dcombobox-list li').has('.ui-dcombobox-hidden-name[value="'+result[i].name+'"]').removeClass("ui-dcombobox-search-result").addClass("ui-dcombobox-search-result");
							}
							$('.ui-dcombobox-list li').not('.ui-dcombobox-search-result').removeClass("ui-dcombobox-search-no-result").addClass("ui-dcombobox-search-no-result");
						});
					}
					
					var treeString = generateTree(this.options['data']);
					var tree = this.tree =  $(treeString).appendTo(wrapper).hide();
					
					//tinh chinh? position cua tree
					$(window).load(function(){
						position = input.position();
						tree.css({'top':position.top+input.outerHeight(true)+2,'left':position.left});
						//console.log(position);
							
							// tinh chinh? height cua arrow voi input
						arrow.outerHeight(input.outerHeight(true),true);
						
						// tinh chinh? do cao cua bullet voi item
						$('.ui-dcombobox-item-wapper',wrapper).each(function(){
							var height = $(this).find('.ui-dcombobox-item').outerHeight(true);
							console.log(height);
							//$(this).find('.ui-dcombobox-bullet').height(height);
							
							/*if($.browser.msie && parseFloat($.browser.version)>=9.0)
								var height = $('.ui-dcombobox-item',this).outerHeight(true);
							else
								var height = $('.ui-dcombobox-item',this).outerHeight(true)+1;
							$('.ui-dcombobox-bullet',this).height(height);*/
						});
						// them style 
						$('.ui-dcombobox-item').each(function(){
							var _self = $(this);
							var parent = $(this).parent();
							var type = $('.ui-dcombobox-hidden-type',parent).val();
							$.each(self.options.styles,function(key,value){
								if(key == type)
									_self.addClass(value);
							});
							
						});
					});
					
					
					$(this.arrow).click(function(e){
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-no-result");
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-result");
						$(tree).slideDown(self.options.slideSpeed);
						if(self.options.enableSearch){
							$(this).select();
							
						}
						e.stopPropagation();
					});
					$(this.input).click(function(e){
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-no-result");
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-result");
						$(tree).slideDown(self.options.slideSpeed);
						if(self.options.enableSearch){
							$(this).select();
							
						}
						e.stopPropagation();
					});
					$('.ui-dcombobox-bullet').click(function(e){
						e.stopPropagation();
					});
					$(document).click(function(e){
						$(tree).slideUp(self.options.slideSpeed);
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-no-result");
						$('.ui-dcombobox-list li').removeClass("ui-dcombobox-search-result");

					});
					$('.ui-dcombobox-item',wrapper).click(function(){
						var parent = $(this).parent().parent();
						// set value cho element hien tai
						self.input.attr("value",$(this).text());
						
						// sau do gan gia tri cho altField
						//window.aaa = parent;
						//console.log(parent.val());
						el.attr("value",parent.val()+':'+$('.ui-dcombobox-hidden-type',parent).val());
					});
					$('.ui-dcombobox-bullet',wrapper).click(function(){
						var parent = $(this).parent().parent();
							if($(this).hasClass("ui-dcombobox-bullet-show")){
								//$(this).html(' + ');
								$("img",this).attr("src","img/plus.png");
								$(this).removeClass("ui-dcombobox-bullet-show");
								
								// hide child 
								$('> ul',parent).slideUp(self.options.slideSpeed);
							}
							else
							{
								//$(this).html(' - ');
								
								$("img",this).attr("src","img/sub.png");
								$(this).addClass("ui-dcombobox-bullet-show");
								// show child 
								$('> ul',parent).slideDown(self.options.slideSpeed);
							}
							
						});
					
					
					// restore value when el !=null
					//console.log(el.val() != null);
					 if(el.val() != null){
						var item  = getItem(el.val(),this.options.data);
						if(item != "NULL")
							this.input.attr('value',item.name);
						else
							this.input.attr('value','NULL');
					}
					}
				});
				
			})(jQuery);