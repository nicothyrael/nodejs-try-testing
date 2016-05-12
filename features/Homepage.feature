Feature: Homepage and menu

Scenario: Homepage

  Given I open 'http://localhost:8080' webpage
  Then the title is 'Localization Services'


Scenario: Open menu Tools

  Given I open 'http://localhost:8080' webpage
  When I click in 'Tools' menu
  Then the 'Tools' menu is 'open'

Scenario: Close menu Tools

  Given I open 'http://localhost:8080' webpage
  And I click in 'Tools' menu
  When I click again in 'Tools' menu
  Then the 'Tools' menu is not 'open'
