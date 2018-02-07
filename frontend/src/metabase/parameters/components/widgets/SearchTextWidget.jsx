/* @flow */

import React, { Component } from "react";

import FieldValuesWidget from "metabase/components/FieldValuesWidget";
import Popover from "metabase/components/Popover";
import Button from "metabase/components/Button";
import RemappedValue from "metabase/containers/RemappedValue";

import Field from "metabase-lib/lib/metadata/Field";

type Props = {
    value: any,
    setValue: () => void,

    isEditing: bool,

    fields: Field[],
};

type State = {
    isFocused: bool,
};

export default class SearchTextWidget extends Component<*, Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            isFocused: false,
            value: props.value,
        };
    }

    static noPopover = true;

    static format(value, field) {
        if (!Array.isArray(value)) {
            value = [value];
        }
        if (value.length > 1) {
            return `${value.length} selections`;
        } else {
            return <RemappedValue value={value[0]} column={field} />
        }
    }

    render() {
        let { setValue, isEditing, fields, parentFocusChanged } = this.props;
        let { value, isFocused } = this.state;

        const field = fields[0];

        if (!Array.isArray(value)) {
          value = value != null ? [value] : [];
        }

        const defaultPlaceholder = isFocused ? "" : (this.props.placeholder || t`Enter a value...`);

        const focusChanged = (isFocused) => {
            if (parentFocusChanged) parentFocusChanged(isFocused);
            this.setState({isFocused})
        };

        const placeholder = isEditing ? "Enter a default value..." : defaultPlaceholder;

        if (!isFocused) {
            return (
                <div className="flex-full" onClick={() => focusChanged(true)}>
                    { value.length > 0 ?
                      SearchTextWidget.format(value, field)
                    :
                      <span>
                        {placeholder}
                      </span>
                    }
                </div>
            );
        } else {
            return (
              <Popover
                tetherOptions={{
                    attachment: "top left",
                    targetAttachment: "top left",
                    targetOffset: "-15 -25"
                }}
                hasArrow={false}
                onClose={() => focusChanged(false)}
              >
                <FieldValuesWidget
                  // TODO: multi
                  value={value}
                  onChange={(value) => {
                    this.setState({ value });
                  }}
                  placeholder={placeholder}
                  field={field}
                  multi
                  autoFocus
                  color="brand"
                  style={{
                    borderWidth: 2,
                    minWidth: 182
                  }}
                />
                <Button
                  primary
                  className="mx1 mb1"
                  onClick={() => {
                    setValue(value);
                    focusChanged(false);
                  }}
                >
                  Done
                </Button>
              </Popover>
            )
            // return (
            //     <FieldSearchInput
            //         value={value}
            //         onChange={setValue}
            //         isFocused={isFocused}
            //         onFocus={() => focusChanged(true)}
            //         onBlur={() => focusChanged(false)}
            //         autoFocus={this.state.isFocused}
            //         placeholder={isEditing ? "Enter a default value..." : defaultPlaceholder}
            //         field={field}
            //         searchField={field && field.parameterSearchField()}
            //     />
            // )
        }
    }
}
