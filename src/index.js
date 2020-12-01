import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

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
      //data: [],
	  data: rows,
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
        <div className="upload-file" align="center">
          <label className="carga">Cargar Archivo:</label>
		  <br/>
		  <br/>
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

const emails = ['username@gmail.com', 'user02@gmail.com'];

function Tabla(props){
  const classes = useStyles();
  const titulo = 'Visualizador NetCDF';
  const [tituloDialog, setTituloDialog] = React.useState(false);
  const [valorDialog, setValorDialog] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
 
  function handleClickOpen (tit, val){
    setOpen(true);
	setTituloDialog(tit);
	setValorDialog(val);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };
  
  return (
  <div>
    <br/>
    <div className="tabla" align="center">{titulo}</div>
	<br/>
    <TableContainer>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Nombre</StyledTableCell>
            <StyledTableCell align="center">Tipo de dato</StyledTableCell>
            <StyledTableCell align="center">Descripción</StyledTableCell>
            <StyledTableCell align="center">Dimensiones</StyledTableCell>
            <StyledTableCell align="center">Grupo</StyledTableCell>
			<StyledTableCell align="center">Forma</StyledTableCell>
			<StyledTableCell align="center">Unidades</StyledTableCell>
			<StyledTableCell align="center"></StyledTableCell>
			<StyledTableCell align="center"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((dato) => (
            <StyledTableRow key={dato.nombre}>
              <StyledTableCell component="th" scope="row">{dato.nombre}</StyledTableCell>
              <StyledTableCell align="center">{dato.tipoDato}</StyledTableCell>
              <StyledTableCell align="center">{dato.descripcion}</StyledTableCell>
              <StyledTableCell align="center">{dato.dimensiones}</StyledTableCell>
              <StyledTableCell align="center">{dato.grupo}</StyledTableCell>
			  <StyledTableCell align="center">{dato.forma}</StyledTableCell>
			  <StyledTableCell align="center">{dato.unidades}</StyledTableCell>
			  <StyledTableCell align="center">
				<Button variant="contained" color="primary" onClick={(e) => handleClickOpen('Valor', dato.valores, e)}>Valores</Button>
			  </StyledTableCell>
			  <StyledTableCell align="center">
				<Button variant="contained" color="secondary" onClick={(e) => handleClickOpen('Atributo', dato.atributos, e)}>Atributos</Button>
			  </StyledTableCell>
            </StyledTableRow>
          ))}		  
        </TableBody>
      </Table>
    </TableContainer>
	<div><SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} titulo= {tituloDialog} valor={valorDialog} /></div>
	</div>
  );
}


const StyledTableCell = withStyles((theme) => ({
  head: {
	fontFamily: 'Century Gothic',
	
    backgroundColor: '#045973',
    color: theme.palette.common.white,
	fontSize: 18,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: '#D8DBFD',
    },
  },
}))(TableRow);

function createData(nombre, tipoDato, descripcion, dimensiones, grupo, forma, unidades, valores, atributos) {
  return { nombre, tipoDato, descripcion, dimensiones, grupo, forma, unidades, valores, atributos };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 1, 1, 10, 11),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 1, 1, 20, 21),
  createData('Eclair', 262, 16.0, 24, 6.0, 1, 1, 30, 31),
  createData('Cupcake', 305, 3.7, 67, 4.3, 1, 1, 40, 41),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1, 1, 50, 51),
];

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});


function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open, titulo, valor } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{titulo}</DialogTitle>
	  <br/>
      <div className="textodialog" align="center">{valor}</div>
	  <br/>
	  <br/>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  valor: PropTypes.string.isRequired,
};

ReactDOM.render(
  <Visualizador />,
  document.getElementById('root')
);