/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nProvider } from '@kbn/i18n/react';
import { EuiWrappingPopover } from '@elastic/eui';

import { OptionsMenu } from './options';

let isOpen = false;

const container = document.createElement('div');

const onClose = () => {
  ReactDOM.unmountComponentAtNode(container);
  isOpen = false;
};

export function showOptionsPopover({
  anchorElement,
  useMargins,
  onUseMarginsChange,
  hidePanelTitles,
  onHidePanelTitlesChange,
  syncColors,
  onSyncColorsChange,
}: {
  anchorElement: HTMLElement;
  useMargins: boolean;
  onUseMarginsChange: (useMargins: boolean) => void;
  syncColors: boolean;
  onSyncColorsChange: (syncColors: boolean) => void;
  hidePanelTitles: boolean;
  onHidePanelTitlesChange: (hideTitles: boolean) => void;
}) {
  if (isOpen) {
    onClose();
    return;
  }

  isOpen = true;

  document.body.appendChild(container);
  const element = (
    <I18nProvider>
      <EuiWrappingPopover id="popover" button={anchorElement} isOpen={true} closePopover={onClose}>
        <OptionsMenu
          useMargins={useMargins}
          onUseMarginsChange={onUseMarginsChange}
          hidePanelTitles={hidePanelTitles}
          onHidePanelTitlesChange={onHidePanelTitlesChange}
          syncColors={syncColors}
          onSyncColorsChange={onSyncColorsChange}
        />
      </EuiWrappingPopover>
    </I18nProvider>
  );
  ReactDOM.render(element, container);
}
