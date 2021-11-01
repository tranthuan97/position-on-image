
const coords = "117,145,118,235,422,79,422,125,421,168,419,216,419,257,719,56,718,148,716,235";
const arrayCoords = [];

coords.split(',').forEach((item, index, array) => {
  if (index % 2 === 0) {
    const [left, top] = [item, array[index + 1]];
    // console.log(`position: 'absolute', top: 'topValuepx', left: 'leftValuepx',`);
    // console.log(`<div style=" position: absolute; top: topValuepx; left: leftValuepx; "><input id='index' /></div>`);
    console.log(`{ boxMatchStyle: { position: 'absolute', top: 'topValuepx', left: '${left}px', width: 20, height: 20, backgroundColor: 'gray', borderRadius: '50%' }, }, //${index / 2}`);
    // console.log(`<div style=" position: absolute; top: ${top - 14}px; left: ${left - 16}px; "><input id='${index / 2}' /></div>`);
  };
});