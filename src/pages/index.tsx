import { useStore } from 'react-redux';

const Index = () => {
  const store = useStore();

  return (
    <div>
      <div>
        <button type="button" onClick={() => {}}>
          Read
        </button>
      </div>
      <span>
        {JSON.stringify(store.getState())}
      </span>
    </div>
  );
};

export default Index;
