import { Button, Input } from 'antd';
import React from 'react';
import UploadImage from '../UploadImage';
const { TextArea } = Input;

const SetPosition = props => {

  const [img, setImg] = React.useState('')
  const [saveStyle, setSaveStyle] = React.useState('');
  const [inputSave, setInputSave] = React.useState('');
  const [output, setOutput] = React.useState('');
  const [position, setPosition] = React.useState([]);
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
    const parentWidth = document.getElementById('imgTest').offsetWidth;
    const parentHeight = document.getElementById('imgTest').offsetHeight;
    document.getElementById(dragId).style.top = (styleTop < 0 ? 0 : styleTop >= parentHeight ? parentHeight : styleTop) + 'px'
    document.getElementById(dragId).style.left = (styleLeft < 0 ? 0 : styleLeft >= parentWidth ? parentWidth : styleLeft) + 'px'
    position[dragId].top = styleTop < 0 ? 0 : styleTop >= parentHeight ? parentHeight : styleTop;
    position[dragId].left = styleLeft < 0 ? 0 : styleLeft >= parentWidth ? parentWidth : styleLeft;

    setPosition(Array.from(position))
  }

  const setCoordie = (e) => {
    const { clientX, clientY, target } = e
    const x0 = target.x;
    const y0 = target.y;

    const mouseX = clientX;
    const mouseY = clientY;
    const left = mouseX - x0;
    const top = mouseY - y0
    if (target.tagName === 'DIV') return ''

    position.push({ top, left, id: position.length });
    setPosition([...position])
  }

  // const str = `position: "absolute", width: "30px", height: "30px", borderRadius: "50%", border: "1px dashed gray", transform: "translate(-50%, -50%)"`

  return (
    <div>
      <div style={{ position: 'relative', border: '2px dashed black', width: 'fit-content', margin: 10 }} onClick={setCoordie}>
        <img id="imgTest" src={img} alt="img" />
        {
          position.map((item, index) => {
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
              onMouseDownCapture={() => dragElement(document.getElementById(item.id))}
              style={{
                position: 'absolute',
                transform: "translate(-50%, -50%)",
                top: item.top,
                left: item.left,
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: "1px solid red",
                background: 'white',
                ...arr[0]
              }} />
          })
        }
      </div>
      <div style={{ paddingInline: 20 }}>
        <div style={{ marginTop: 10, marginBottom: 2 }}>style:</div> <Input onChange={(e) => {
          const { value } = e.target;
          setSaveStyle(value);
        }} style={{ marginTop: 5 }} />

        <div style={{ marginTop: 10, marginBottom: 2 }}>template: </div><Input onChange={(e) => {
          const { value } = e.target;
          setInputSave(value);
        }} style={{ marginTop: 5 }} />
        <div style={{ marginTop: 10, marginBottom: 2 }}>output: </div>
        <TextArea value={output} rows={4} />
        <Button onClick={() => {
          let str = ''
          position.forEach((item, index) => {
            str += `${inputSave.replace('topValue', item.top).replace('leftValue', item.left).replace('index', index)}\n`;
          })
          setOutput(str);
        }}>Export</Button>
        <UploadImage getImg={setImg} />
      </div>
    </div>
  );
};

SetPosition.propTypes = {

};

export default SetPosition;