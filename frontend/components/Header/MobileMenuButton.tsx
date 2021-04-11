import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { showSidebar } from '../../redux/sidebar/actions';

const Button = styled.button`
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  outline: none;
  fill: #fff;
`;

const MenuSvg = styled.svg.attrs({
  viewBox: '0 0 24 24',
  fillRule: 'evenodd',
  clipRule: 'evenodd',
})`
  width: 100%;
  height: 100%;
`;

const MobileMenuButton: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Button onClick={() => dispatch(showSidebar())}>
      <MenuSvg>
        <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z" />
      </MenuSvg>
    </Button>
  );
};

export default MobileMenuButton;
