import React from 'react';
import { RingLoader } from 'react-spinners'
import { MapType } from 'components/types'

export const Loading = (props: MapType) => {
  return (
    props.loading &&

    <div style={{
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      top: '0',
      left: '0',
      background: '#ffffffb7',
      zIndex: '1000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <RingLoader color='#004b9e' />
    </div>
  )
}

export default Loading;