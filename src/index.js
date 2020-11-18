import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Visualizador extends React.Component {
  render() {
    return (
      <div className="visualizador">
        <div className="visualizador-archivo">
            <CargarArchivo />
        </div>
      </div>
    );
  }
}

class CargarArchivo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data: [],
      error: null,
    }
  }

  uploadJSONFiles(event) {
    event.preventDefault();
    let formData = new FormData(); 
    for(let key of Object.keys(event.target.files)) {
      if (key !== 'length') {
        formData.append('file', event.target.files[key]);
      }
    }
    fetch('http://localhost:8080/netCDF/leerArchivo', { 
      method: 'POST',
      body: formData
    }).then(response => response.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            data: result.datos
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            error
          });
        }
      );
  }
  render() {
    return(
      <div className="cargaArchivo">
        <div className="upload-file">
          <label>Cargar Archivo</label>
          <input type="file"
            onChange={(event) => this.uploadJSONFiles(event)} 
            multiple/>
        </div>
        <div className="visualizador-peticion">
        <Tabla data={this.state.data}/>
        </div>
    </div>
    );
  }
}

function Tabla(props){
  const titulo = 'Visualizador NetCDF';
  return (
    <div className="tabla">
        <div className="titulo">{titulo}</div>
        <div className="board-row">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo de dato</th>
                <th>Descripcion</th>
                <th>Dimensiones</th>
                <th>Grupo</th>
                <th>Forma</th>
                <th>Unidades</th>
              </tr>
            </thead>
            <tbody>
              {props.data.map((dato) => (
                <tr key={dato.nombre} >
                <td>{dato.nombre}</td>
                <td>{dato.tipoDato}</td>
                <td>{dato.descripcion}</td>
                <td>{dato.dimensiones}</td>
                <td>{dato.grupo}</td>
                <td>{dato.forma}</td>
                <td>{dato.unidades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}


ReactDOM.render(
  <Visualizador />,
  document.getElementById('root')
);