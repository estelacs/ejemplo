//Global Variables
var ov_siteurl="http://127.0.0.1/ejemplo_app";

//Get the screen and viewport size
var viewport_width=$(window).outerWidth();
var viewport_height=$(window).outerHeight();
var screen_width=screen.width;
var screen_height=screen.height; 

function onBodyLoad(page, lang)
{	
    document.addEventListener("deviceready", onDeviceReady, false);  
    
    $("#ov_volver_01").click(function(e){
		onBackKeyDown();						
	});
	$("#ov_menu_01").click(function(e){
		onMenuKeyDown();		
	});	 

    $('.ov_contenedor_01').css("min-height",(viewport_height)+"px");
}

function onDeviceReady()
{
	document.addEventListener("backbutton", onBackKeyDown, false);
	document.addEventListener("menubutton", onMenuKeyDown, false);
}    
function onBackKeyDown()
{
	window.history.back();
}
function onMenuKeyDown()
{
	window.location.href='menu.html';
}

function ov_send_contact(formid)
{
	$("#ov_loader_gif").show();
	
	var values=$('#'+formid).serialize();
	
	var splitted1=values.split("&");
	var splitted2="";
	for(i=0;i<splitted1.length;i++)
	{
	   	splitted2=splitted1[i].split("=");	   	
	   	if(splitted2[0]=="contact_email" || splitted2[0]=="contact_name")
	   	{
	   		if(splitted2[1]=="")
	   		{
		   		alert("Los campos marcados con * son obligatorios");
		   		return false;
		   	}
	   	}
	}
	
	if(!ov_ajax_operation(values,"send_contact"))
	{
		alert("Se ha producido un error al enviar.");
	   	return false;
	}
	else
	{
		alert("Envío correcto a "+result);
	   	return true;
	}	
}

function ov_ajax_operation(values,operation)
{
	var retorno=false;		
	$.ajax({
	  type: 'POST',
	  url: ov_siteurl+"/server/ajax_operations.php",
	  data: { v: values, op: operation },
	  success: h_proccess,
	  error:h_error,
	  dataType: "json",
	  async:false
	});			
	function h_proccess(data){
		
		if(data.error=="0")
		{			
			if(data.warning!="0")
			{
				alert(data.warning);
			}
			retorno=data.result;
		}
		else
		{
			alert(data.error+" - "+data.error_message); // uncomment to trace errors
			retorno=false;
		}				
	}
	function h_error(jqXHR, textStatus, errorThrown)
	{
		console.log(errorThrown);
		retorno=false;		
	}					
	return retorno;
}

function ov_ajax_operation_cross(values,operation)
{
	var retorno=false;		
	$.ajax({
	  type: 'POST',
	  url: ov_siteurl+"/server/ajax_operations.php",
	  data: { v: values, op: operation },
	  beforeSend: function( xhr ) {
	    xhr.overrideMimeType("text/javascript");
	  },
	  success: h_proccess_p,
	  error:function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            console.log(errorThrown);
            alert(jqXHR.responseText+" - "+errorThrown);
            retorno=false;
         },
	  dataType: "jsonp",
      jsonp: 'callback',
      jsonpCallback: 'jsonpCallback',
	  async:false
	});		
	function jsonpCallback(data){
        alert("jsonp");
        console.log(data);
        retorno=data.result;
    }	
	function h_proccess_p(data){

		console.log(data);

		if(data.error=="0")
		{			
			if(data.warning!="0")
			{
				alert(data.warning);
			}
			retorno=data.result;
		}
		else
		{
			alert(data.error+" - "+data.error_message); // uncomment to trace errors
			retorno=false;
		}			
	}	
	return retorno;					
}

function get_var_url(variable){

	var tipo=typeof variable;
	var direccion=location.href;
	var posicion=direccion.indexOf("?");
	
	posicion=direccion.indexOf(variable,posicion) + variable.length; 
	
	if (direccion.charAt(posicion)== "=")
	{ 
        var fin=direccion.indexOf("&",posicion); 
        if(fin==-1)
        	fin=direccion.length;
        	
        return direccion.substring(posicion+1, fin); 
    } 
	else
		return false;
	
}
