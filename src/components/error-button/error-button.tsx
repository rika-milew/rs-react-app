import React from 'react';
import { Button } from '@/components/button/button';

type State = {
  hasError: boolean;
};

export class ErrorButton extends React.Component<object, State> {
  public state: State = {
    hasError: false,
  };

  public render() {
    if (this.state.hasError) {
      throw new Error('Test error triggered');
    }

    return (
      <Button
        text="Trigger error"
        variant="error"
        onClick={() => {
          this.setState({ hasError: true });
        }}
      />
    );
  }
}
