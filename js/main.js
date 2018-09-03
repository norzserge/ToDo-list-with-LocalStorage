$(document).ready(function() {

	var lSLength = localStorage.length;
	var localValue;
	var newId = 0;
	
	// объявление функции вывода загрузки элементов из localStorage в DOM после обновления страницы
	function getValueAfterReload() {
		if(lSLength > 0) {
			for (i = 0; i < lSLength; i++) {
			  var key = localStorage.key(i);
			  $('.todo-list').append("<li class='item' data-item=" + localStorage.key(i).slice(7)  + ">" + localStorage[key] + "</li>");
			}
		}
	}

	// вызов функции вывода элементов из localStorage в DOM
	getValueAfterReload();

	// добавление нового элемента по нажатию на Enter
	$('#todo-input').keydown(function(e){		
		var task = this.value;
		if(e.keyCode === 13) {
			$('.item').each(function(index, el){
	          var maxId = $(this).attr('data-item');
	          if(maxId > newId) {
	            newId = maxId;
	          }
	        })
        	newId++;
			localStorage.setItem('taskId_' + newId, task);
			localValue = localStorage.getItem('taskId_' + newId);
			$('.todo-list').append("<li class='item' data-item='" + newId + "'><span class='item-value'>" + localValue + "</span></li>");
			this.value = '';
		}
	});
	
	// добавление меню редактирования
	$('.todo-list').on({
	    mouseenter: function () {
			var listElem = $(this);
	        listElem.append('<div class="hover-edit-menu"><a href="#" class="edit-button"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a> <a href="#" class="remove-button"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a></div>');
			
			// удаление определенного элемента списка ol из DOM и из localStorage	
			$('.hover-edit-menu').on('click', '.remove-button', function(){
				var elem = $(this).closest('.item', '.todo-list');
				localStorage.removeItem("taskId_" + elem.attr("data-item"));
				elem.remove();
			});	    
			
			// редактирование значения элемента списка
			$('.hover-edit-menu').on('click', '.edit-button', function(){
				var currentTask = listElem;
				var currentTaskValue = currentTask.text();
				var newTaskValue;

				// добавляем поле редактирования и подставляем в него текущий value
				currentTask.html('<input type="text" class="form-control edit-input" value="' + currentTaskValue + '"> <a href="#" class="save-button"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></a> <a href="#" class="cancel-button"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>'); 

				// сохраняем изменение в поле редактирования
				$('.save-button').on('click', function(){
					newTaskValue = $('.edit-input').val();
					localStorage.setItem('taskId_' + listElem.attr('data-item'), newTaskValue);
					currentTask.text(newTaskValue);
				});

				// отменяем введенные изменения
				$('.cancel-button').on('click', function(){
					currentTask.text(currentTaskValue);
				});				
			});	
			
			// скрываем edit-menu если поле редактирования открыто
			if($('.edit-input').is(':visible')) {
				$('.hover-edit-menu').hide();
			}
	    },

	    mouseleave: function () {
	        $('.hover-edit-menu').remove();        
	    }

	}, '.item');


	// очищение списка ol и localStorage
	$('.btn-default').click(function(){
		$('.item').remove();
		localStorage.clear();
		newId = 0;
	});

});
