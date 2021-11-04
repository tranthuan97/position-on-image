import React from 'react';
import { Button, Input } from 'antd';
import UploadImage from '../UploadImage';
import './styles.css';

const { TextArea } = Input;

const inputStylesDedault = 'position: "absolute", transform: "translate(-50%, -50%)", width: "30px", height: "30px", borderRadius: "50%", border: "1px solid red", background: "white"';
const saveStyleDefault = 'position: "absolute", transform: "translate(-50%, -50%)", width: "30px", height: "30px", borderRadius: "50%", border: "1px solid red", background: "white"';
const inputSaveDefault = `<div style=" position: absolute; {top}; {left}; "><input id='{index}' /></div>`;

const SetPosition = () => {
  const [saveStyle, setSaveStyle] = React.useState(saveStyleDefault);
  const [inputSave, setInputSave] = React.useState(inputSaveDefault);
  const [position, setPosition] = React.useState([]);
  const [output, setOutput] = React.useState('');
  const [img, setImg] = React.useState('')
  const targetItemRef = React.useRef(null);
  const positionRef = React.useRef(null);
  positionRef.current = position;
  var styleTop = 0
  var styleLeft = 0
  var dragId = 0;

  function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      elmnt.onmousedown = dragMouseDown;
    }
    dragId = elmnt.id;
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

      styleTop = (elmnt.offsetTop - pos2);
      styleLeft = (elmnt.offsetLeft - pos1);
    }
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    if (!styleTop && !styleLeft) return;

    const parentWidth = document.getElementById('imgTest').offsetWidth;
    const parentHeight = document.getElementById('imgTest').offsetHeight;

    position.find(x => x.id === parseInt(dragId)).top = styleTop < 0 ? 0 : styleTop >= parentHeight ? parentHeight : styleTop;
    position.find(x => x.id === parseInt(dragId)).left = styleLeft < 0 ? 0 : styleLeft >= parentWidth ? parentWidth : styleLeft;

    document.getElementById(dragId).style.top = (styleTop < 0 ? 0 : styleTop >= parentHeight ? parentHeight : styleTop) + 'px'
    document.getElementById(dragId).style.left = (styleLeft < 0 ? 0 : styleLeft >= parentWidth ? parentWidth : styleLeft) + 'px'

    setPosition(Array.from(position))
  }

  const setCoordinates = (e) => {
    const { clientX, clientY, target } = e
    const x0 = target.x;
    const y0 = target.y;

    const mouseX = clientX;
    const mouseY = clientY;
    const left = mouseX - x0;
    const top = mouseY - y0
    if (target.tagName === 'DIV') return ''
    const id = position[position.length - 1]?.id ?? 0;
    targetItemRef.current = id + 1;
    position.push({ top, left, id: id + 1 });
    setPosition([...position])
  }

  const setTargetPosition = (e, pRef, tRef, destination, inCrease) => {
    e.preventDefault();
    inCrease ?
      pRef.current.find(x => x.id === tRef.current)[destination] += 1 :
      pRef.current.find(x => x.id === tRef.current)[destination] -= 1
    setPosition(Array.from(pRef.current))
  }

  const disableKeyDown = (e) => {
    if (targetItemRef.current !== null) {
      e.preventDefault()
    }
  }

  window.addEventListener('click', (e) => {
    if (!e.target.id) {
      targetItemRef.current = null;
    }
  })

  const exportScript = () => {
    let str = ''
    position.forEach((item, index) => {
      str += `${inputSave.replace('{top}', `top: ${item.top}px`)
        .replace('{left}', `left: ${item.left}px`)
        .replace('{index}', index)}\n`;
    })
    setOutput(str);
  }

  const renderPosition = (item, index) => {
    let joinString = '';
    saveStyle && saveStyle.split(/(\w+:)/g).forEach((element, index) => {
      joinString += index % 2 !== 0 ? `"${element.replace(':', '')}":` : element;
    })
    let arr = [{}];
    try {
      arr = JSON.parse(`[{${joinString}}]`)
    } catch (error) {
    }
    return <div
      id={item.id}
      key={index}
      onMouseDownCapture={(e) => {
        dragElement(document.getElementById(item.id));
        targetItemRef.current = item.id
      }}
      style={{
        top: item.top,
        left: item.left,
        ...arr[0]
      }} />
  }

  React.useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const { key } = e;
      if (targetItemRef.current === null) return;
      switch (key) {
        case 'ArrowRight':
          setTargetPosition(e, positionRef, targetItemRef, 'left', true)
          break;
        case 'ArrowLeft':
          setTargetPosition(e, positionRef, targetItemRef, 'left', false)
          break;
        case 'ArrowUp':
          setTargetPosition(e, positionRef, targetItemRef, 'top', false)
          break;
        case 'ArrowDown':
          setTargetPosition(e, positionRef, targetItemRef, 'top', true)
          break;
        case 'Backspace':
          setPosition(Array.from(positionRef.current.filter(x => x.id !== targetItemRef.current)))
          break;
        default:
          break;
      }
    });
  }, [])

  return (
    <div>
      {
        img ?
          <div
            onClick={setCoordinates}
            style={{ position: 'relative', border: '2px dashed black', width: 'fit-content', margin: 20 }}>
            <img id="imgTest" src={img} alt="img" />
            {position.map(renderPosition)}
          </div> :
          <h2>Upload image to get position !</h2>
      }
      <div style={{ paddingInline: 20 }}>
        <div style={{ marginTop: 10, marginBottom: 2 }}>style:</div>
        <Input
          className="fontSizeInput"
          onKeyDown={disableKeyDown}
          style={{ marginTop: 5, color: 'blue' }}
          defaultValue={inputStylesDedault} onChange={(e) => setSaveStyle(e.target.value)} />

        <div style={{ marginTop: 10, marginBottom: 2 }}>
          template - parameters: {`{top}`}; {`{left}`} {`{index}`}
        </div>

        <Input
          value={inputSave}
          className="fontSizeInput"
          onKeyDown={disableKeyDown}
          style={{ marginTop: 5, color: 'green' }}
          onChange={(e) => setInputSave(e.target.value)} />

        <div style={{ marginTop: 10, marginBottom: 2 }}>output: </div>

        <TextArea
          rows={10}
          value={output}
          style={{ color: 'green' }}
          onKeyDown={disableKeyDown}
        />
        <Button onClick={exportScript}>Export</Button>

        <Button
          onClick={() => {
            setOutput('');
            setPosition([]);
          }}
        >Delete all position</Button>

        <UploadImage getImg={setImg} />
      </div>
    </div>
  );
};

export default SetPosition;