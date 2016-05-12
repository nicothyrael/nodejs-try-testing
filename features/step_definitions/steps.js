module.exports = function () {
  this.Given(/^I open '([^"]*)' webpage$/, function (webpage) {
    this
      .url(webpage)
      .waitForElementVisible('body', 1000);
  });

  this.Then(/^the title is '([^"]*)'$/, function (title) {
    this.assert.title(title);
  });

  this.When(/^I click in '([^"]*)' menu$/, function (arg1) {
    this.getText('a.dropdown-toggle', function(result) {
      this.assert.equal(result.value, arg1);
      this.click('a.dropdown-toggle');
    });
  });

  this.Then(/^the '([^"]*)' menu is '([^"]*)'$/, function (arg1, arg2) {
    this.getText('a.dropdown-toggle', function(result) {
      this.assert.equal(result.value, arg1);
      this.expect.element('ul.nav.navbar-nav.navbar-right li').to.have.attribute('className')
    .which.equals(arg2);
    });
  });

  this.When(/^I click again in '([^"]*)' menu$/, function (arg1) {
    this.getText('a.dropdown-toggle', function(result) {
      this.assert.equal(result.value, arg1);
      this.click('a.dropdown-toggle');
    });
       });

  this.Then(/^the '([^"]*)' menu is not '([^"]*)'$/, function (arg1, arg2) {
    this.getText('a.dropdown-toggle', function(result) {
      this.assert.equal(result.value, arg1);
      this.expect.element('ul.nav.navbar-nav.navbar-right li').to.have.attribute('className')
    .which.not.equals(arg2);
    });
  });
};
