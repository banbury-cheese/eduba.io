export function FlowBaseStyles() {
  return (
    <style>
      {`
      .react-flow {
        width: 100%;
        height: 100%;
        position: relative;
      }
      .react-flow__renderer,
      .react-flow__zoompane,
      .react-flow__viewport {
        width: 100%;
        height: 100%;
      }
      .react-flow__node {
        font-family: "Diatype", "Helvetica Neue", Arial, sans-serif;
      }
      .react-flow__handle {
        display: none;
      }
      .react-flow__edge-textbg {
        fill: rgba(249, 236, 223, 0.9);
      }
      .react-flow__controls {
        display: none;
      }
      .react-flow__attribution {
        display: none;
      }
      `}
    </style>
  );
}
