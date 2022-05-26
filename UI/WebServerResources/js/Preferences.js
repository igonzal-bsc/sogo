!function(){"use strict";function e(e,t){e.state("preferences",{abstract:!0,views:{preferences:{templateUrl:"preferences.html",controller:"PreferencesController",controllerAs:"app"}}}).state("preferences.general",{url:"/general",views:{module:{templateUrl:"generalPreferences.html"}}}).state("preferences.calendars",{url:"/calendars",views:{module:{templateUrl:"calendarsPreferences.html"}}}).state("preferences.addressbooks",{url:"/addressbooks",views:{module:{templateUrl:"addressbooksPreferences.html"}}}).state("preferences.mailer",{url:"/mailer",views:{module:{templateUrl:"mailerPreferences.html"}}}),t.rules.otherwise("/general")}function t(e,t,s,a){e.DebugEnabled||a.defaultErrorHandler(function(){}),s.onError({to:"preferences.**"},function(e){"preferences"==e.to().name||e.ignored()||(t.error("transition error to "+e.to().name+": "+e.error().detail),a.go({state:"preferences"}))})}angular.module("SOGo.PreferencesUI",["ui.router","sgCkeditor","angularFileUpload","SOGo.Common","SOGo.MailerUI","SOGo.ContactsUI","SOGo.Authentication","as.sortable"]).config(e).run(t),e.$inject=["$stateProvider","$urlServiceProvider"],t.$inject=["$window","$log","$transitions","$state"]}(),function(){"use strict";function e(i,e,t,s,r,a,n,o,c,d){var f=this,u=e.usesCASAuthentication||e.usesSAML2Authentication;function h(){f.account.security&&f.account.security.hasCertificate&&f.account.$certificate().then(function(e){f.certificate=e},function(){delete f.account.security.hasCertificate})}function m(e){e=0<e.type.indexOf("pkcs12")||/\.(p12|pfx)$/.test(e.name);return f.form.certificateFilename.$setValidity("fileformat",e),e}this.defaultPort=143,this.defaults=n,this.account=o,this.accountId=c,this.hostnameRE=u&&0<c?/^(?!(127\.0\.0\.1|localhost(?:\.localdomain)?)$)/:/./,this.addressesSearchText="",this.ckConfig={autoGrow_minHeight:70,toolbar:[["Bold","Italic","-","Link","Font","FontSize","-","TextColor","BGColor","Source"]],language:n.ckLocaleCode},this.account.encryption?"ssl"==this.account.encryption&&(this.defaultPort=993):this.account.encryption="none",h(),this.uploader=new s({url:[a.activeUser("folderURL")+"Mail",c,"importCertificate"].join("/"),autoUpload:!1,queueLimit:1,filters:[{name:m,fn:m}],onAfterAddingFile:function(e){f.certificateFilename=e.file.name},onSuccessItem:function(e,t,s,a){this.clearQueue(),i(function(){_.assign(f.account,{security:{hasCertificate:!0},$$certificate:t})}),h()},onErrorItem:function(e,t,s,a){r.alert(l("Error"),l("An error occurred while importing the certificate. Verify your password."))}}),this.hasIdentities=function(){return 0<_.filter(this.account.identities,this.isEditableIdentity).length},this.isEditableIdentity=function(e){return!e.isReadOnly},this.selectIdentity=function(e){this.selectedIdentity==e?this.selectedIdentity=null:this.selectedIdentity=e},this.hasDefaultIdentity=function(){return 0<=_.findIndex(this.account.identities,function(e){return!!e.isDefault})},this.setDefaultIdentity=function(e,s){return _.forEach(this.account.identities,function(e,t){t==s?e.isDefault=!e.isDefault:delete e.isDefault}),e.stopPropagation(),!1},this.canRemoveIdentity=function(e){return e==this.selectedIdentity&&this.hasIdentities()},this.removeIdentity=function(e){this.account.identities.splice(e,1),this.selectedIdentity=null},this.addIdentity=function(){var e=_.findIndex(this.account.identities,{isReadOnly:1}),t={};e<0&&(e=this.account.identities.length),this.customFromIsReadonly()&&(t.fullName=this.account.identities[0].fullName),this.account.identities.splice(Math.max(e,0),0,t),this.selectedIdentity=e},this.showCkEditor=function(e){return this.selectedIdentity==e&&"html"==this.defaults.SOGoMailComposeMessageType},this.filterEmailAddresses=function(t){return _.filter(e.defaultEmailAddresses,function(e){return 0<=e.toLowerCase().indexOf(t.toLowerCase())})},this.customFromIsReadonly=function(){return!(0<c)&&!d},this.importCertificate=function(){this.uploader.queue[0].formData=[{password:this.certificatePassword}],this.uploader.uploadItem(0)},this.onBeforeUploadCertificate=function(e){this.form=e,this.uploader.clearQueue()},this.removeCertificate=function(){this.account.$removeCertificate()},this.cancel=function(){t.cancel()},this.save=function(){t.hide()}}e.$inject=["$timeout","$window","$mdDialog","FileUploader","Dialog","sgSettings","defaults","account","accountId","mailCustomFromEnabled"],angular.module("SOGo.PreferencesUI").controller("AccountDialogController",e)}(),function(){"use strict";function e(e,t,s,a,i,r,n,o,c){var d=t.sieveCapabilities,f=t.forwardEnabled;t.vacationEnabled;this.filter=i,this.mailboxes=r,this.labels=n,this.fieldLabels={subject:l("Subject"),from:l("From"),to:l("To"),cc:l("Cc"),to_or_cc:l("To or Cc"),size:l("Size (Kb)"),header:l("Header")},-1<d.indexOf("body")&&(this.fieldLabels.body=l("Body")),this.methodLabels={discard:l("Discard the message"),keep:l("Keep the message"),stop:l("Stop processing filter rules")},f&&(this.methodLabels.redirect=l("Forward the message to")),-1<d.indexOf("reject")&&(this.methodLabels.reject=l("Send a reject message")),-1<d.indexOf("fileinto")&&(this.methodLabels.fileinto=l("File the message in")),(-1<d.indexOf("imapflags")||-1<d.indexOf("imap4flags"))&&(this.methodLabels.addflag=l("Flag the message with")),this.methods=["fileinto","addflag","stop","keep","discard","redirect","reject"],this.methods=_.intersection(this.methods,_.keys(this.methodLabels)),this.numberOperatorLabels={under:l("is under"),over:l("is over")},this.textOperatorLabels={is:l("is"),is_not:l("is not"),contains:l("contains"),contains_not:l("does not contain"),matches:l("matches"),matches_not:l("does not match")},-1<d.indexOf("regex")&&(this.textOperatorLabels.regex=l("matches regex"),this.textOperatorLabels.regex_not=l("does not match regex")),this.cancel=function(){s.cancel()},this.hasRulesAndActions=function(){var e=[this.filter.actions];return"allmessages"!=this.filter.match&&e.push(this.filter.rules),_.every(e,function(e){return e&&0<e.length})},this.save=function(e){if(this.invalid=!1,this.filter.actions)try{_.forEach(_.filter(this.filter.actions,{method:"redirect"}),function(e){o(e.argument)})}catch(e){return this.invalid=e.message,!1}s.hide()},this.addMailFilterRule=function(e){this.filter.rules||(this.filter.rules=[]),this.filter.rules.push({field:"subject",operator:"contains"})},this.removeMailFilterRule=function(e){this.filter.rules.splice(e,1)},this.addMailFilterAction=function(e){this.filter.actions||(this.filter.actions=[]),this.filter.actions.push({method:"fileinto"})},this.removeMailFilterAction=function(e){this.filter.actions.splice(e,1)}}e.$inject=["$scope","$window","$mdDialog","Dialog","filter","mailboxes","labels","validateForwardAddress","Preferences"],angular.module("SOGo.PreferencesUI").controller("FiltersDialogController",e)}(),function(){"use strict";function e(r,n,s,a,i,o,c,d,f,u,h,m,e,t){var p=this,g=[];(new Date).beginOfDay();function C(){var a;g.length||d.activeUser("path").mail&&(a=new m({id:0})).$getMailboxes().then(function(){for(var e=a.$flattenMailboxes({all:!0}),t=-1,s=e.length;++t<s;)g.push(e[t])})}function w(e){var t,s=[];if(0<n.forwardConstraints){if(t=n.defaultEmailAddresses,_.forEach(t,function(e){e=e.split("@")[1];e&&s.push(e.toLowerCase())}),t=e.split("@")[1].toLowerCase(),s.indexOf(t)<0&&1==n.forwardConstraints)throw new Error(l("You are not allowed to forward your messages to an external email address."));if(0<=s.indexOf(t)&&2==n.forwardConstraints)throw new Error(l("You are not allowed to forward your messages to an internal email address."));if(2==n.forwardConstraints&&0<n.forwardConstraintsDomains.length&&n.forwardConstraintsDomains.indexOf(t)<0)throw new Error(l("You are not allowed to forward your messages to this domain:")+" "+t)}return!0}this.$onInit=function(){this.preferences=e,this.passwords={newPassword:null,newPasswordConfirmation:null,oldPassword:null},this.timeZonesList=n.timeZonesList,this.timeZonesSearchText="",this.addressesSearchText="",this.mailLabelKeyRE=new RegExp(/^(?!^_\$)[^(){} %*\"\\\\]*?$/),this.emailSeparatorKeys=e.defaults.emailSeparatorKeys,"delay"==e.defaults.SOGoMailAutoMarkAsReadMode?this.mailAutoMarkAsReadDelay=Math.max(1,this.preferences.defaults.SOGoMailAutoMarkAsReadDelay):this.mailAutoMarkAsReadDelay=5,e.defaults.SOGoAlternateAvatar&&(h.$alternateAvatar=e.defaults.SOGoAlternateAvatar),d.activeUser("path").mail&&(this.sieveVariablesCapability=0<=n.sieveCapabilities.indexOf("variables"),this.preferences.hasActiveExternalSieveScripts()),this.updateVacationDates()},this.go=function(e,t){t.$valid&&(a("gt-md")||i("left").close(),s.go("preferences."+e))},this.onLanguageChange=function(e){e.$valid&&u.confirm(l("Warning"),l("Save preferences and reload page now?"),{ok:l("Yes"),cancel:l("No")}).then(function(){p.save(e,{quick:!0}).then(function(){n.location.reload(!0)})})},this.onDesktopNotificationsChange=function(){this.preferences.defaults.SOGoDesktopNotifications&&this.preferences.authorizeNotifications()},this.resetContactsCategories=function(e){this.preferences.defaults.SOGoContactsCategories=n.defaultContactsCategories,e.$setDirty()},this.resetCalendarCategories=function(e){this.preferences.defaults.SOGoCalendarCategories=_.keys(n.defaultCalendarCategories),this.preferences.defaults.SOGoCalendarCategoriesColorsValues=_.values(n.defaultCalendarCategories),e.$setDirty()},this.addCalendarCategory=function(e){var t=_.indexOf(this.preferences.defaults.SOGoCalendarCategories,l("New category"));t<0&&(this.preferences.defaults.SOGoCalendarCategories.push(l("New category")),this.preferences.defaults.SOGoCalendarCategoriesColorsValues.push("#aaa"),e.$setDirty(),t=this.preferences.defaults.SOGoCalendarCategories.length-1),f("calendarCategory_"+t)},this.resetCalendarCategoryValidity=function(e,t){t["calendarCategory_"+e].$setValidity("duplicate",!0)},this.removeCalendarCategory=function(e,t){this.preferences.defaults.SOGoCalendarCategories.splice(e,1),this.preferences.defaults.SOGoCalendarCategoriesColorsValues.splice(e,1),t.$setDirty()},this.addContactCategory=function(e){var t=_.indexOf(this.preferences.defaults.SOGoContactsCategories,"");t<0&&(this.preferences.defaults.SOGoContactsCategories.push(""),t=this.preferences.defaults.SOGoContactsCategories.length-1),f("contactCategory_"+t),e.$setDirty()},this.removeContactCategory=function(e,t){this.preferences.defaults.SOGoContactsCategories.splice(e,1),t.$setDirty()},this.onMailAutoMarkAsReadDelay=function(){this.preferences.defaults.SOGoMailAutoMarkAsReadDelay=this.mailAutoMarkAsReadDelay},this.addMailAccount=function(e,t){var s=this.preferences.defaults.AuxiliaryMailAccounts.length,a=new m({id:s,isNew:!0,name:"",identities:[{fullName:"",email:""}],receipts:{receiptAction:"ignore",receiptNonRecipientAction:"ignore",receiptOutsideDomainAction:"ignore",receiptAnyAction:"ignore"}});o.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account=new",targetEvent:e,locals:{defaults:this.preferences.defaults,account:a,accountId:s,mailCustomFromEnabled:n.mailCustomFromEnabled}}).then(function(){angular.isArray(p.preferences.settings.Mail.ExpandedFolders)||(p.preferences.settings.Mail.ExpandedFolders=["/0"]),p.preferences.settings.Mail.ExpandedFolders.push("/"+s),p.preferences.defaults.AuxiliaryMailAccounts.push(a.$omit()),t.$setDirty()})},this.editMailAccount=function(e,t,s){var a=_.assign({id:t},_.cloneDeep(this.preferences.defaults.AuxiliaryMailAccounts[t])),i=new m(a);o.show({controller:"AccountDialogController",controllerAs:"$AccountDialogController",templateUrl:"editAccount?account="+t,targetEvent:e,locals:{defaults:this.preferences.defaults,account:i,accountId:t,mailCustomFromEnabled:n.mailCustomFromEnabled}}).then(function(){p.preferences.defaults.AuxiliaryMailAccounts[t]=i.$omit(),s.$setDirty()}).catch(_.noop)},this.removeMailAccount=function(e,t){this.preferences.defaults.AuxiliaryMailAccounts.splice(e,1),t.$setDirty()},this.resetMailLabelValidity=function(e,t){t["mailIMAPLabel_"+e].$setValidity("duplicate",!0)},this.addMailLabel=function(e){guid();this.preferences.defaults.SOGoMailLabelsColorsKeys.push("label"),this.preferences.defaults.SOGoMailLabelsColorsValues.push(["New label","#aaa"]),f("mailLabel_"+(_.size(this.preferences.defaults.SOGoMailLabelsColorsKeys)-1)),e.$setDirty()},this.removeMailLabel=function(e,t){this.preferences.defaults.SOGoMailLabelsColorsKeys.splice(e,1),this.preferences.defaults.SOGoMailLabelsColorsValues.splice(e,1),t.$setDirty()},this.addMailFilter=function(e,t){var s={match:"all",active:1};C(),o.show({templateUrl:"editFilter?filter=new",controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:e,locals:{filter:s,mailboxes:g,labels:this.preferences.defaults.SOGoMailLabelsColors,validateForwardAddress:w}}).then(function(){p.preferences.defaults.SOGoSieveFilters||(p.preferences.defaults.SOGoSieveFilters=[]),p.preferences.defaults.SOGoSieveFilters.push(s),t.$setDirty()})},this.editMailFilter=function(e,t,s){var a=angular.copy(this.preferences.defaults.SOGoSieveFilters[t]);C(),o.show({templateUrl:"editFilter?filter="+t,controller:"FiltersDialogController",controllerAs:"filterEditor",targetEvent:null,locals:{filter:a,mailboxes:g,labels:this.preferences.defaults.SOGoMailLabelsColors,validateForwardAddress:w}}).then(function(){p.preferences.defaults.SOGoSieveFilters[t]=a,s.$setDirty()},_.noop)},this.removeMailFilter=function(e,t){this.preferences.defaults.SOGoSieveFilters.splice(e,1),t.$setDirty()},this.onFiltersOrderChanged=function(t){return this._onFiltersOrderChanged||(this._onFiltersOrderChanged=function(e){t.$setDirty()}),this._onFiltersOrderChanged},this.filterEmailAddresses=function(t){return _.filter(_.difference(n.defaultEmailAddresses,this.preferences.defaults.Vacation.autoReplyEmailAddresses),function(e){return 0<=e.toLowerCase().indexOf(t.toLowerCase())})},this.addDefaultEmailAddresses=function(e){var t=[];angular.isDefined(this.preferences.defaults.Vacation.autoReplyEmailAddresses)&&(t=this.preferences.defaults.Vacation.autoReplyEmailAddresses),this.preferences.defaults.Vacation.autoReplyEmailAddresses=_.union(n.defaultEmailAddresses,t),e.$setDirty()},this.userFilter=function(e,t){return!e||e.length<d.minimumSearchLength()?[]:h.$filter(e,t).then(function(e){return _.forEach(e,function(e){e.$$image||(e.image?e.$$image=e.image:e.$$image=p.preferences.avatar(e.c_email,40,{no_404:!0}))}),e})},this.manageSieveScript=function(e){this.preferences.hasActiveExternalSieveScripts(!1),e.$setDirty()},this.confirmChanges=function(e,t){var s;if(t.$dirty&&t.$valid){for(e.preventDefault(),e.stopPropagation(),s=e.target;"A"!=s.tagName;)s=s.parentNode;u.confirm(l("Unsaved Changes"),l("Do you want to save your changes made to the configuration?"),{ok:l("Save"),cancel:l("Don't Save")}).then(function(){p.save(t,{quick:!0}).then(function(){n.location=s.href})},function(){n.location=s.href})}},this.save=function(a,t){var e,s,i=!0;if(this.preferences.defaults.Forward&&this.preferences.defaults.Forward.enabled&&this.preferences.defaults.Forward.forwardAddress){s=this.preferences.defaults.Forward.forwardAddress;try{for(e=0;e<s.length;e++)w(s[e])}catch(e){u.alert(l("Error"),e),i=!1}}return this.preferences.defaults.SOGoMailLabelsColorsKeys.length==this.preferences.defaults.SOGoMailLabelsColorsValues.length&&this.preferences.defaults.SOGoMailLabelsColorsKeys.length==_.uniq(this.preferences.defaults.SOGoMailLabelsColorsKeys).length||(u.alert(l("Error"),l("IMAP labels must have unique names.")),_.forEach(this.preferences.defaults.SOGoMailLabelsColorsKeys,function(e,t,s){a["mailIMAPLabel_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["mailIMAPLabel_"+t].$setValidity("duplicate",!1),i=!1)})),this.preferences.defaults.SOGoCalendarCategories.length!=_.uniq(this.preferences.defaults.SOGoCalendarCategories).length&&(u.alert(l("Error"),l("Calendar categories must have unique names.")),_.forEach(this.preferences.defaults.SOGoCalendarCategories,function(e,t,s){a["calendarCategory_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["calendarCategory_"+t].$setValidity("duplicate",!1),i=!1)})),this.preferences.defaults.SOGoContactsCategories.length!=_.uniq(this.preferences.defaults.SOGoContactsCategories).length&&(u.alert(l("Error"),l("Contact categories must have unique names.")),_.forEach(this.preferences.defaults.SOGoContactsCategories,function(e,t,s){a["contactCategory_"+t].$dirty&&(s.indexOf(e)!=t||-1<s.indexOf(e,t+1))&&(a["contactCategory_"+t].$setValidity("duplicate",!1),i=!1)})),i?this.preferences.$save().then(function(e){t&&t.quick||(c.show(c.simple().textContent(l("Preferences saved")).position("bottom right").hideDelay(2e3)),a.$setPristine())}):r.reject("Invalid form")},this.canChangePassword=function(e){return this.passwords.newPasswordConfirmation&&this.passwords.newPasswordConfirmation.length&&this.passwords.newPassword!=this.passwords.newPasswordConfirmation?(e.newPasswordConfirmation.$setValidity("newPasswordMismatch",!1),!1):(e.newPasswordConfirmation.$setValidity("newPasswordMismatch",!0),!!(this.passwords.newPassword&&0<this.passwords.newPassword.length&&this.passwords.newPasswordConfirmation&&this.passwords.newPasswordConfirmation.length&&this.passwords.newPassword==this.passwords.newPasswordConfirmation&&this.passwords.oldPassword&&0<this.passwords.oldPassword.length))},this.changePassword=function(){t.changePassword(null,null,this.passwords.newPassword,this.passwords.oldPassword).then(function(){var e=o.alert({title:l("Password"),textContent:l("The password was changed successfully."),ok:l("OK")});o.show(e).finally(function(){})},function(e){e=o.alert({title:l("Password"),textContent:e,ok:l("OK")});o.show(e).finally(function(){})})},this.timeZonesListFilter=function(t){return _.filter(this.timeZonesList,function(e){return 0<=e.toUpperCase().indexOf(t.toUpperCase())})},this.updateVacationDates=function(){var e=this.preferences.defaults;e&&e.Vacation&&e.Vacation.enabled&&(this.toggleVacationStartDate(),this.toggleVacationEndDate())},this.toggleVacationStartDate=function(){var e=this.preferences.defaults.Vacation;e.startDateEnabled&&(e.startDate||(e.startDate=new Date),e.endDateEnabled&&e.endDate&&e.startDate.getTime()>e.endDate.getTime()&&(e.startDate=new Date(e.endDate.getTime()),e.startDate.addDays(-1)))},this.toggleVacationEndDate=function(){var e=this.preferences.defaults.Vacation;e.endDateEnabled&&(e.endDate||(e.endDate=new Date),e.startDateEnabled&&e.startDate&&e.endDate.getTime()<e.startDate.getTime()&&(e.endDate=new Date(e.startDate.getTime()),e.endDate.addDays(1)))},this.validateVacationStartDate=function(e){var t=p.preferences.defaults,s=!0;return s=t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.startDateEnabled?!t.Vacation.endDateEnabled||!t.Vacation.endDate||e.getTime()<=t.Vacation.endDate.getTime():s},this.validateVacationEndDate=function(e){var t=p.preferences.defaults,s=!0;return s=t&&t.Vacation&&t.Vacation.enabled&&t.Vacation.endDateEnabled?!t.Vacation.startDateEnabled||!t.Vacation.startDate||e.getTime()>=t.Vacation.startDate.getTime():s},this.toggleVacationStartTime=function(){var e=this.preferences.defaults.Vacation;e.startTimeEnabled&&!e.startTime&&(e.startTime=new Date)},this.toggleVacationEndTime=function(){var e=this.preferences.defaults.Vacation;e.endTimeEnabled&&!e.endTime&&(e.endTime=new Date)}}e.$inject=["$q","$window","$state","$mdMedia","$mdSidenav","$mdDialog","$mdToast","sgSettings","sgFocus","Dialog","User","Account","Preferences","Authentication"],angular.module("SOGo.PreferencesUI").controller("PreferencesController",e)}();
//# sourceMappingURL=Preferences.js.map