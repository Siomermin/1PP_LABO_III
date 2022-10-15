<?php

// ModificarProductoEnvadadoFoto.php: Se recibirán por POST los siguientes valores: producto_json (id,
// codigoBarra, nombre, origen y precio, en formato de cadena JSON) y la foto (para modificar un producto
// envasado en la base de datos. Invocar al método modificar.
// Nota: El valor del id, será el id del producto envasado 'original', mientras que el resto de los valores serán los del
// producto envasado a ser modificado.
// Si se pudo modificar en la base de datos, la foto original del registro modificado se moverá al subdirectorio
// “./productosModificados/”, con el nombre formado por el nombre punto origen punto 'modificado' punto hora,
// minutos y segundos de la modificación (Ejemplo: aceite.italia.modificado.105905.jpg).
// Se retornará un JSON que contendrá: éxito(bool) y mensaje(string) indicando lo acontecido.

require_once("./clases/accesoDatos.php");
require_once("./clases/neumaticoBD.php");

use Gonzalez\Fermin\NeumaticoBD;
use Gonzalez\Fermin\AccesoDatos;

$neumatico_json = isset($_POST["neumatico_json"]) ? $_POST["neumatico_json"] : NULL;
$pathFoto = isset($_FILES["foto"]) ? $_FILES["foto"] : NULL;

$retorno = new stdClass();
$retorno->exito = false;
$retorno->mensaje = "No se pudo modificar el neumatico";


if ($neumatico_json) 
{
    $obj = json_decode($neumatico_json, true);

    $neumatico_original = NeumaticoBD::TraerProducto($obj["id"]);

    if($neumatico_original) 
	{
        $path =  NeumaticoBD::getPath($pathFoto, $obj["marca"]);
        $neumatico_modificado = new NeumaticoBD($obj["marca"], $obj["medidas"], $obj["precio"],
        $obj["id"], $path);
    
        if($neumatico_modificado->modificar()) 
		{
			NeumaticoBD::guardarImagen($path);
            $path_actual = $neumatico_original->getFoto();
            $tipoArchivo = pathinfo($path_actual, PATHINFO_EXTENSION);
            $path_destino = "./neumaticosModificados/" .
            $neumatico_original->getId() . "." . $neumatico_original->getMarca() . ".modificado." . date("G") . date("i") . date("s") .".". $tipoArchivo;
            copy($path_actual, $path_destino);
            unlink($path_actual);
    
            $retorno->exito = true;
            $retorno->mensaje = "Neumatico modificado";
        }

    }

    echo json_encode($retorno);

} 


