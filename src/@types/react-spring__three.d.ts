declare module '@react-spring/three' {
  import { AnimatedProps } from '@react-spring/shared';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { ReactNode } from 'react';

  export const a: {
    mesh: React.ComponentType<AnimatedProps<JSX.IntrinsicElements['mesh']>>;
    // Add other animated elements as needed
  };

  export function useSpring<T extends object = object>(props: T): T & { to: (arg: (value: unknown) => unknown) => unknown };
}
