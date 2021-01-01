/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei/useGLTF'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/models/test123/test123.glb') as any
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh material={nodes['1igtcif_A_SES_surface'].material} geometry={nodes['1igtcif_A_SES_surface'].geometry} />
      <mesh material={nodes['1igtcif_B_SES_surface'].material} geometry={nodes['1igtcif_B_SES_surface'].geometry} />
      <mesh material={nodes['1igtcif_C_SES_surface'].material} geometry={nodes['1igtcif_C_SES_surface'].geometry} />
      <mesh material={nodes['1igtcif_D_SES_surface'].material} geometry={nodes['1igtcif_D_SES_surface'].geometry} />
    </group>
  )
}

useGLTF.preload('/models/test123/test123.glb')
