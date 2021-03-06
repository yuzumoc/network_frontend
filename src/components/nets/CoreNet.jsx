import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { HUBIMAGE, SERVERIMAGE } from '../../constants/urls';
import { getRandomArbitrary } from '../../utils/mathutils';
import DeviceModal from '../DeviceModal';
// import { connect } from 'react-redux';

const CoreNet = ({dynamic}) => {
  const container = useRef(null);

  const nodes = [
    { id: 1, label: '192.168.0.100', image: HUBIMAGE, shape: "image", group: 1, x: 200, y: 0, size: 50 },
    { id: 2, label: '192.168.0.101', image: HUBIMAGE, shape: "image", group: 1, x: 100, y: 200, size: 50 },
    { id: 3, label: '192.168.0.102', image: HUBIMAGE, shape: "image", group: 1, x: 300, y: 200, size: 50 },
    { id: 4, label: '192.168.0.103', image: SERVERIMAGE, shape: "image", group: 2, x: 0, y: 400, size: 50  },
    { id: 5, label: '192.168.0.104', image: SERVERIMAGE, shape: "image", group: 2, x: 200, y: 400, size: 50  },
    { id: 6, label: '192.168.0.105', image: SERVERIMAGE, shape: "image", group: 2, x: 400, y: 400, size: 50  }
  ];
  let edges = [
    { from: 1, to: 2, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 2, to: 4, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 2, to: 5, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 2, to: 6, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 1, to: 4, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 1, to: 5, label: getRandomArbitrary(900,1100) + "Mb/s" },
    { from: 1, to: 6, label: getRandomArbitrary(900,1100) + "Mb/s" },
  ];

  const options = {physics: false};
  const [nodeId, setNodeId ] = useState(0)
  const [isOpen, setIsOpen ] = useState(false)
  const [deviceType, setDeviceType ] = useState(0)

  const closeModal = () => setIsOpen(false)
  const showModal = () => setIsOpen(true)
  
  //create network first time
  useEffect(() => {
    const network = container.current &&
    new Network(container.current, { nodes, edges }, options);
    network.on("selectNode", (params) => {
      setNodeId(params.nodes[0])
      console.log(params.nodes[0])
      if (params.nodes[0] <= 3) {
        setDeviceType(0)
      } else {
        setDeviceType(1)
      }
      showModal()
    });
  }, []);

  //dynamic transmitt speed change
  useEffect(() => {
    if (!dynamic) return false 
    const interval = setInterval(() => {
      console.log("interval test")
      edges = edges.map((item)=>{
        item.label = getRandomArbitrary(900,1100) + "Mb/s"
        return item
      })
      const network =
      container.current &&
      new Network(container.current, { nodes, edges }, options);
      network.on("selectNode", (params) => {
        setNodeId(params.nodes[0])
        console.log(params.nodes[0])
        if (params.nodes[0] <= 3) {
          setDeviceType(0)
        } else {
          setDeviceType(1)
        }
        showModal()
      });
    }, 1000);
    return () => clearInterval(interval)
  }, [dynamic])
  return (
  <div>
      <div ref={container} style={{ float: 'left', height: '500px', width: '100%', borderRight: 'dashed #CCCCFF' }} />
      <DeviceModal id={nodeId}
        type={deviceType}
        isOpen={isOpen}
        onRequestClose={closeModal}
      />
  </div>
  );
};

export default CoreNet
