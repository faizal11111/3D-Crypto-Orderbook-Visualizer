Plan for Enhancing 3D Order Book Visualization (Orderbook3D.tsx)

Information Gathered:
- Current Orderbook3D.tsx uses @react-three/fiber and drei for 3D rendering.
- Bars are static boxes with height representing quantity.
- Rotation animation is applied to the whole group.
- No smooth height animation or color gradients.
- User interaction via OrbitControls is enabled.

Plan:
- Use react-spring/three to animate bar height and position smoothly on data updates.
- Add color gradients or emissive materials to bars for glow effect.
- Add pulsating scale or glow animation to bars to make them visually dynamic.
- Smooth rotation easing on the group instead of constant speed.
- Add subtle floating animation to bars for liveliness.
- Keep OrbitControls for user interaction.

Dependent Files:
- Only src/components/Orderbook3D.tsx will be modified.
- May need to add react-spring dependency if not present.

Follow-up Steps:
- Verify if react-spring is installed; if not, install it.
- Test the updated 3D visualization for performance and visual appeal.
- Ask user for feedback on the new animation and style.

This plan aims to make the 3D order book visualization more beautiful and animated while maintaining usability.
