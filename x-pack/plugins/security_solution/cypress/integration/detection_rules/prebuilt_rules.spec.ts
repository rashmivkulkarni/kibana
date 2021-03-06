/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  COLLAPSED_ACTION_BTN,
  ELASTIC_RULES_BTN,
  RELOAD_PREBUILT_RULES_BTN,
  RULES_ROW,
  RULES_TABLE,
  SHOWING_RULES_TEXT,
} from '../../screens/alerts_detection_rules';

import { goToManageAlertsDetectionRules, waitForAlertsIndexToBeCreated } from '../../tasks/alerts';
import {
  changeRowsPerPageTo300,
  deleteFirstRule,
  deleteSelectedRules,
  loadPrebuiltDetectionRules,
  goToNextPage,
  reloadDeletedRules,
  selectNumberOfRules,
  waitForRulesTableToBeLoaded,
  waitForPrebuiltDetectionRulesToBeLoaded,
} from '../../tasks/alerts_detection_rules';
import { loginAndWaitForPageWithoutDateRange } from '../../tasks/login';

import { DETECTIONS_URL } from '../../urls/navigation';

import { totalNumberOfPrebuiltRules } from '../../objects/rule';
import { cleanKibana } from '../../tasks/common';

describe('Alerts rules, prebuilt rules', () => {
  beforeEach(() => {
    cleanKibana();
  });

  it('Loads prebuilt rules', () => {
    const expectedNumberOfRules = totalNumberOfPrebuiltRules;
    const expectedElasticRulesBtnText = `Elastic rules (${expectedNumberOfRules})`;

    loginAndWaitForPageWithoutDateRange(DETECTIONS_URL);
    waitForAlertsIndexToBeCreated();
    goToManageAlertsDetectionRules();
    waitForRulesTableToBeLoaded();
    loadPrebuiltDetectionRules();
    waitForPrebuiltDetectionRulesToBeLoaded();

    cy.get(ELASTIC_RULES_BTN).should('have.text', expectedElasticRulesBtnText);

    changeRowsPerPageTo300();

    cy.get(SHOWING_RULES_TEXT).should('have.text', `Showing ${expectedNumberOfRules} rules`);
    cy.get(RULES_TABLE).then(($table1) => {
      const firstScreenRules = $table1.find(RULES_ROW).length;
      goToNextPage();
      cy.get(RULES_TABLE).then(($table2) => {
        const secondScreenRules = $table2.find(RULES_ROW).length;
        const totalNumberOfRules = firstScreenRules + secondScreenRules;

        expect(totalNumberOfRules).to.eql(expectedNumberOfRules);
      });
    });
  });
});

describe('Deleting prebuilt rules', () => {
  beforeEach(() => {
    const expectedNumberOfRules = totalNumberOfPrebuiltRules;
    const expectedElasticRulesBtnText = `Elastic rules (${expectedNumberOfRules})`;

    cleanKibana();
    loginAndWaitForPageWithoutDateRange(DETECTIONS_URL);
    waitForAlertsIndexToBeCreated();
    goToManageAlertsDetectionRules();
    waitForRulesTableToBeLoaded();
    loadPrebuiltDetectionRules();
    waitForPrebuiltDetectionRulesToBeLoaded();

    cy.get(ELASTIC_RULES_BTN).should('have.text', expectedElasticRulesBtnText);

    changeRowsPerPageTo300();
  });

  it('Does not allow to delete one rule when more than one is selected', () => {
    const numberOfRulesToBeSelected = 2;
    selectNumberOfRules(numberOfRulesToBeSelected);

    cy.get(COLLAPSED_ACTION_BTN).each((collapsedItemActionBtn) => {
      cy.wrap(collapsedItemActionBtn).should('have.attr', 'disabled');
    });
  });

  it('Deletes and recovers one rule', () => {
    const expectedNumberOfRulesAfterDeletion = totalNumberOfPrebuiltRules - 1;
    const expectedNumberOfRulesAfterRecovering = totalNumberOfPrebuiltRules;

    deleteFirstRule();
    cy.reload();
    changeRowsPerPageTo300();

    cy.get(ELASTIC_RULES_BTN).should(
      'have.text',
      `Elastic rules (${expectedNumberOfRulesAfterDeletion})`
    );
    cy.get(RELOAD_PREBUILT_RULES_BTN).should('exist');
    cy.get(RELOAD_PREBUILT_RULES_BTN).should('have.text', 'Install 1 Elastic prebuilt rule ');

    reloadDeletedRules();

    cy.get(RELOAD_PREBUILT_RULES_BTN).should('not.exist');

    cy.reload();
    changeRowsPerPageTo300();

    cy.get(ELASTIC_RULES_BTN).should(
      'have.text',
      `Elastic rules (${expectedNumberOfRulesAfterRecovering})`
    );
  });

  it('Deletes and recovers more than one rule', () => {
    const numberOfRulesToBeSelected = 2;
    const expectedNumberOfRulesAfterDeletion = totalNumberOfPrebuiltRules - 2;
    const expectedNumberOfRulesAfterRecovering = totalNumberOfPrebuiltRules;

    selectNumberOfRules(numberOfRulesToBeSelected);
    deleteSelectedRules();
    cy.reload();
    changeRowsPerPageTo300();

    cy.get(RELOAD_PREBUILT_RULES_BTN).should('exist');
    cy.get(RELOAD_PREBUILT_RULES_BTN).should(
      'have.text',
      `Install ${numberOfRulesToBeSelected} Elastic prebuilt rules `
    );
    cy.get(ELASTIC_RULES_BTN).should(
      'have.text',
      `Elastic rules (${expectedNumberOfRulesAfterDeletion})`
    );

    reloadDeletedRules();

    cy.get(RELOAD_PREBUILT_RULES_BTN).should('not.exist');

    cy.reload();
    changeRowsPerPageTo300();

    cy.get(ELASTIC_RULES_BTN).should(
      'have.text',
      `Elastic rules (${expectedNumberOfRulesAfterRecovering})`
    );
  });
});
