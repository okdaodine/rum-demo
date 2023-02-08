import { observer, useLocalObservable } from 'mobx-react-lite';
import Dialog from 'components/Dialog';
import { TextField } from '@material-ui/core';
import Button from 'components/Button';
import { IProfile } from 'apis/types';
import { TrxApi } from 'apis';
import store from 'store2';

interface IProps {
  profile: IProfile | null
  open: boolean
  onClose: () => void
  onProfileChanged: (profile: IProfile) => void,
}

const ProfileEditor = observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    name: props.profile ? props.profile.name : '',
  }));

  const addProfile = async () => {
    try {
      if (!state.name) {
        return;
      }
      const res = await TrxApi.createActivity({
        type: 'Create',
        object: {
          type: 'Person',
          name: state.name
        }
      });
      console.log(res);
      const profile = {
        name: state.name,
        userAddress: store('address')
      };
      props.onProfileChanged(profile);
      props.onClose();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-[300px] p-8 pt-6">
      <div className="text-18 text-center font-bold pb-4">Edit profile</div>
      <div>
        <TextField
          className="w-full"
          placeholder="nickname"
          size="small"
          value={state.name}
          onChange={(e) => { state.name = e.target.value; }}
          margin="dense"
          variant="outlined"
          type="memo"
        />
      </div>
      <div className="mt-5 flex justify-center">
        <Button onClick={addProfile}>Save</Button>
      </div>
    </div>
  )
});

export default observer((props: IProps) => (
  <Dialog
    hideCloseButton
    open={props.open}
    onClose={props.onClose}
    transitionDuration={{
      enter: 300,
    }}
  >
    <ProfileEditor {...props} />
  </Dialog>
));
