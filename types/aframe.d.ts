// Global AFRAME object (loaded via script tag in _document)
declare const AFRAME: {
    registerComponent: (name: string, definition: Record<string, unknown>) => void;
    components: Record<string, unknown>;
    [key: string]: unknown;
};

declare module 'aframe-react' {
  import * as React from 'react';

  interface EntityProps extends React.HTMLAttributes<HTMLElement> {
    primitive?: string;
    position?: string;
    rotation?: string;
    scale?: string;
    material?: string;
    geometry?: string;
    src?: string;
    [key: string]: unknown;
  }

  export const Entity: React.FC<EntityProps>;
  export const Scene: React.FC<React.HTMLAttributes<HTMLElement>>;
}

// Ambient declarations for A-Frame HTML elements used in JSX
declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-sky': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { src?: string; [key: string]: unknown },
      HTMLElement
    >;
    'a-entity': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-assets': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'a-image': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-camera': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-cursor': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-sound': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
    'a-text': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { [key: string]: unknown },
      HTMLElement
    >;
  }
}
