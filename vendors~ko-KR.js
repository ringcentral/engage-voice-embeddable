(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{1334:function(e,t,u){"use strict";var a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var l=function(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}({},((a=u(1294))&&a.__esModule?a:{default:a}).default.userMediaPermission,"오디오에 액세스할 수 있도록 {application}에 권한을 부여하세요.");t.default=l},1351:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(736))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.internalError,"내부 오류로 인해 로그인하지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.accessDenied,"액세스가 거부되었습니다. 지원팀에 문의하세요."),n(l,d.default.sessionExpired,"세션이 만료되었습니다. 로그인해 주세요."),l);t.default=r},1368:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(548))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.noToNumber,"유효한 전화번호를 입력하세요."),n(l,d.default.noAreaCode,"7자리 지역 전화번호를 사용하도록 {areaCodeLink}을(를) 설정하세요."),n(l,d.default.specialNumber,"긴급 또는 특별 서비스 번호로 전화 걸기는 지원되지 않습니다."),n(l,d.default.connectFailed,"연결에 실패했습니다. 나중에 다시 시도하세요."),n(l,d.default.internalError,"내부 오류로 인해 연결할 수 없습니다. 나중에 다시 시도하세요."),n(l,d.default.notAnExtension,"내선 번호가 없습니다."),n(l,d.default.networkError,"네트워크 문제로 인해 연결할 수 없습니다. 나중에 다시 시도하세요."),n(l,d.default.noInternational,"국제 전화를 걸 수 있는 권한이 없습니다. {brand} 계정 관리자에게 문의하여 업그레이드하세요."),n(l,d.default.noRingoutEnable,"내선에서 데스크톱 앱을 사용하여 전화를 걸 수 있습니다.\n    다른 통화 옵션으로 전화하려면\n    계정 관리자에게 문의하여 업그레이드하세요."),n(l,"areaCode","지역 코드"),n(l,"telus911","긴급 전화 걸기는 지원되지 않습니다."),l);t.default=r},1385:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1295))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=d.default.holdConflictError,o=d.default.unHoldConflictError,i=d.default.muteConflictError,f=d.default.unMuteConflictError,c=d.default.generalError,s=d.default.forwardSuccess,b=(n(l={},i,"이 통화는 다른 디바이스에서 음소거되었습니다. 이 앱에서 제어하기 전에 통화 음소거를 해제하세요."),n(l,o,"이 통화는 다른 디바이스에서 대기되었습니다. 이 앱에서 제어하기 전에 통화 대기를 해제하세요."),n(l,f,"이 통화는 다른 디바이스에서 음소거 해제되었습니다. 이 앱에서 제어하기 전에 통화를 음소거하세요."),n(l,r,"이 통화는 다른 디바이스에서 대기 해제되었습니다. 이 앱에서 제어하기 전에 통화 대기하세요."),n(l,c,"예기치 않은 서버 오류입니다. 나중에 다시 시도하세요."),n(l,s,"착신 전환됨"),l);t.default=b},1402:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1297))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={title:"통화"},d.default.softphone,"데스크톱용 {brand}"),n(l,d.default.browser,"브라우저"),n(l,d.default.jupiter,"{brand}"),n(l,"makeCallsWith","다음으로 내 전화 걸기"),n(l,"ringoutHint","먼저 내 위치에서 울린 다음 호출한 상대방에게 연결"),n(l,"myLocationLabel","내 위치"),n(l,"press1ToStartCallLabel","통화 연결 전에 1번을 누르도록 알림"),n(l,"".concat(d.default.browser,"Tooltip"),"컴퓨터의 마이크와 스피커를 사용하여 전화를 걸고 받으려면 이 옵션을 사용합니다."),n(l,"".concat(d.default.softphone,"Tooltip"),"{brand}을(를) 사용하여 전화를 걸고 받으려면 이 옵션을 사용합니다."),n(l,"".concat(d.default.ringout,"Tooltip"),"선택하거나 입력한 전화번호를 사용하여 전화를 걸려면 이 옵션을 사용합니다."),n(l,"".concat(d.default.ringout,"Tooltip1"),"전화를 걸면 먼저 이 전화벨이 울린 다음 호출한 상대방의 벨이 울립니다."),n(l,"".concat(d.default.jupiter,"Tooltip"),"{brand}을(를) 사용하여 전화를 걸고 받으려면 이 옵션을 사용합니다."),l);t.default=r},1419:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={save:"저장"}},1436:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={ringtones:"벨소리",incomingRingtone:"수신 벨소리",outgoingRingtone:"발신 벨소리",play:"재생",stop:"중지",upload:"업로드",reset:"재설정",save:"저장"}},1453:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1296))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.saveSuccess,"설정이 성공적으로 저장되었습니다."),n(l,d.default.saveSuccessWithSoftphone,"설정이 성공적으로 저장되었습니다. 컴퓨터에 {brand}이(가) 설치되어 있는지 확인하세요."),n(l,d.default.permissionChanged,"최근 권한이 변경되었습니다. {link}(으)로 이동하여 통화 옵션을 확인하세요."),n(l,d.default.phoneNumberChanged,"최근 전화번호 정보가 변경되었습니다. {link}(으)로 이동하여 통화 옵션을 확인하세요."),n(l,"link","설정 > 통화"),n(l,d.default.webphonePermissionRemoved,"권한이 변경되어 브라우저를 사용하여 전화를 걸 수 없습니다. 자세한 내용은 계정 관리자에게 문의하세요."),n(l,d.default.emergencyCallingNotAvailable,"긴급 또는 특별 서비스 번호로 전화 걸기는 지원되지 않습니다. 비상시에는 기존 유선 전화 또는 무선 전화를 사용하여 긴급 번호로 전화를 거세요."),n(l,d.default.saveSuccessWithJupiter,"설정이 성공적으로 저장되었습니다. 컴퓨터에 {brand}이(가) 설치되어 있는지 확인하세요."),l);t.default=r},1470:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1298))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.logCallLogFailed,"예기치 않은 오류로 인해 통화 기록을 로드하지 못했습니다. 페이지를 새로 고치고 다시 시도하세요."),n(l,d.default.logFailed,"죄송합니다. 통화를 기록하지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.fieldRequired,"필수 필드가 필요합니다."),l);t.default=r},1487:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1299))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.requireAdditionalNumbers,"추가 전화 접속 번호를 선택하세요."),n(l,d.default.scheduledSuccess,"전화 회의가 예약되었습니다."),l);t.default=r},1504:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1300))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.bringInFailed,"예기치 않은 오류로 인해 통화를 병합하지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.makeConferenceFailed,"예기치 않은 오류로 인해 통화를 병합하지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.terminateConferenceFailed,"예기치 않은 오류로 인해 전화 회의를 끊지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.removeFromConferenceFailed,"예기치 않은 오류로 인해 참가자를 제거하지 못했습니다. 나중에 다시 시도하세요."),n(l,d.default.callIsRecording,"통화 녹음이 진행 중입니다. 녹음을 중지하고 다시 시도하세요."),l);t.default=r},1521:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(546))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.networkLoss,"죄송합니다. 문제가 발생했습니다. 네트워크 연결을 확인하고 다시 시도하세요."),n(l,d.default.offline,"서버에 연결할 수 없습니다. 나중에 다시 시도하세요."),n(l,d.default.serverUnavailable,"죄송합니다. 시스템에서 문제가 발생했습니다. 나중에 다시 시도하세요."),n(l,d.default.voipOnly,"죄송합니다. 시스템에서 문제가 발생했지만 문제를 해결하기 위해 최선을 다하고 있습니다. 계속해서 전화를 걸 수 있지만 다른 기능은 현재 제한되어 있습니다."),n(l,d.default.survival,"죄송합니다. 시스템에서 문제가 발생했지만 문제를 해결하기 위해 최선을 다하고 있습니다. 특정 기능에 대한 액세스가 제한될 수 있습니다. 앱을 사용할 수 있게 되면 바로 자동으로 복구됩니다."),l);t.default=r},1538:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1301))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.emptyTopic,"모임 주제를 입력하세요."),n(l,d.default.noPassword,"모임 비밀번호를 제공하세요."),n(l,d.default.insufficientPermissions,"{application}에 {permissionName} 권한이 없습니다."),n(l,d.default.scheduledSuccess,"모임이 추가됨"),n(l,d.default.updatedSuccess,"모임이 업데이트됨"),n(l,d.default.meetingIsDeleted,"모임이 삭제됨"),n(l,d.default.internalError,"죄송합니다. 시스템에서 문제가 발생했습니다. 다시 시도하세요."),l);t.default=r},1555:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l=n(u(1302)),d=n(u(1303));function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var o=(r(a={},l.default.sendSuccess,"보내기 성공"),r(a,l.default.sendError,"메시지를 보낼 때 문제가 발생했습니다."),r(a,l.default.numberValidateError,"전화번호 유효성 검사 오류입니다."),r(a,l.default.textEmpty,"보낼 텍스트를 입력하세요."),r(a,l.default.noPermission,"메시지를 보낼 수 있는 권한이 없습니다."),r(a,l.default.senderEmpty,"전화번호에서 보낼 번호를 선택해야 합니다."),r(a,l.default.noToNumber,"유효한 전화번호를 입력하세요."),r(a,l.default.recipientsEmpty,"유효한 수신자 번호를 입력하세요."),r(a,l.default.textTooLong,"텍스트가 너무 깁니다. 1,000자로 제한됩니다."),r(a,l.default.multipartTextTooLong,"텍스트가 너무 깁니다. 5,000자로 제한됩니다."),r(a,l.default.recipientNumberInvalids,"유효한 전화번호를 입력하세요."),r(a,l.default.noAreaCode,"7자리 지역 전화번호를 사용하도록 {areaCodeLink}을(를) 설정하세요."),r(a,l.default.specialNumber,"긴급/특별 서비스 번호로 문자 보내기는 지원되지 않습니다."),r(a,l.default.connectFailed,"연결에 실패했습니다. 나중에 다시 시도하세요."),r(a,l.default.internalError,"내부 오류로 인해 연결할 수 없습니다. 나중에 다시 시도하세요."),r(a,l.default.notAnExtension,"내선 번호가 없습니다."),r(a,l.default.networkError,"네트워크 문제로 인해 연결할 수 없습니다. 나중에 다시 시도하세요."),r(a,l.default.senderNumberInvalid,"회사 외부의 수신자에게 문자 메시지를 보내려면 유효한 전화번호가 필요합니다. 관리자에게 문의하여 직통 번호를 계정에 추가하세요."),r(a,l.default.notSmsToExtension,"대표 전화번호가 포함된 내선 번호로 보낼 수 없습니다. 내선 번호로 보내려면 내선 번호만 입력하세요."),r(a,l.default.internationalSMSNotSupported,"국제 전화번호로 SMS 보내기는 지원되지 않습니다."),r(a,l.default.noInternalSMSPermission,"메시지를 보낼 수 있는 권한이 없습니다. {brand} 계정 관리자에게 문의하여 업그레이드하세요."),r(a,l.default.noSMSPermission,"조직 외부의 수신자에게 메시지를 보낼 수 있는 권한이 없습니다."),r(a,d.default.attachmentCountLimitation,"최대 10개의 첨부 파일."),r(a,d.default.attachmentSizeLimitation,"첨부 파일은 1.5M바이트로 제한됩니다."),r(a,d.default.noAttachmentToExtension,"내선으로 MMS 보내기는 지원되지 않습니다."),r(a,"areaCode","지역 코드"),r(a,l.default.sending,"메시지를 보내는 중... 완료하는 데 몇 분 정도 걸릴 수 있습니다."),a);t.default=o},1572:function(e,t,u){"use strict";var a;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var l=function(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}({},((a=u(1304))&&a.__esModule?a:{default:a}).default.deleteFailed,"내부 서버 오류로 인해 음성 사서함을 삭제할 수 없습니다.");t.default=l},1589:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={rateExceeded:"요청 제한이 초과되었습니다. {ttl}초 후에 앱이 다시 시작됩니다."}},1606:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1305))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={region:"지역"},d.default.saveSuccess,"설정이 성공적으로 저장되었습니다."),n(l,d.default.dialingPlansChanged,"이전 지역은 계정에 대해 더 이상 지원되지 않습니다.\n    새 {regionSettingsLink}을(를) 확인하세요."),n(l,"regionSettings","지역 설정"),n(l,d.default.areaCodeInvalid,"유효한 지역 코드를 입력하세요."),l);t.default=r},1623:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(1306))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.invalidTier,"사용 중인 버전이 {application} 통합을 지원하지 않습니다. 계정 담당자에게 문의하여 {brand} 버전을 업그레이드하세요."),n(l,d.default.insufficientPrivilege,"권한이 부족합니다. 계정 관리자에게 문의하여 업그레이드하세요."),l);t.default=r},1640:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l=n(u(1307)),d=n(u(1308));function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var o=(r(a={},l.default.connectFailed,"죄송합니다. 현재 전화 기능을 사용할 수 없습니다. 나중에 다시 시도하세요. "),r(a,l.default.connected,"WebPhone이 등록되었습니다."),r(a,l.default.browserNotSupported,"죄송합니다. 이 브라우저를 사용하여 전화를 거는 것은 지원되지 않습니다."),r(a,l.default.webphoneCountOverLimit,"최대 5개의 WebPhone을 등록할 수 있습니다."),r(a,l.default.checkDLError,"발신 전화를 걸 수 없습니다. 이 오류가 계속 표시되면 {brandName}에 문의하여 지원을 받으세요."),r(a,l.default.noOutboundCallWithoutDL,"현재 내선에서 브라우저를 사용하여 발신 전화를 걸 수 없습니다. 계정 담당자에게 문의하여 업그레이드하세요."),r(a,l.default.provisionUpdate,"죄송합니다. 시스템에서 문제가 발생했습니다. 곧 자동으로 다시 연결하려고 시도합니다."),r(a,l.default.serverConnecting,"죄송합니다. 전화 서버에 연결하는 데 문제가 있습니다."),r(a,l.default.toVoiceMailError,"내부 오류로 인해 통화를 음성 사서함으로 보낼 수 없습니다."),r(a,l.default.muteError,"현재 통화를 음소거할 수 없습니다."),r(a,l.default.holdError,"현재 통화를 대기할 수 없습니다."),r(a,l.default.flipError,"통화를 전환할 수 없습니다. 나중에 다시 시도하세요."),r(a,l.default.recordError,"현재 통화를 녹음할 수 없습니다. 오류 코드: {errorCode}"),r(a,l.default.recordDisabled,"죄송합니다. 계정에 통화를 녹음하는 기능이 없습니다. 계정 관리자에게 문의하세요."),r(a,l.default.transferError,"통화를 전달할 수 없습니다. 나중에 다시 시도하세요."),r(a,d.default.parked,"다음 위치에서 통화가 대기되었습니다. {parkedNumber}"),r(a,"failWithStatusCode","죄송합니다. 오류({errorCode})가 발생했습니다. 문제가 지속되면 {brandName} 지원팀에 이 오류를 보고하세요."),r(a,"registeringWithStatusCode","죄송합니다. 문제가 발생하여 다시 연결하고 있습니다. 문제가 지속되면 {brandName} 지원팀에 이 오류를 보고하세요. 오류 코드: {errorCode}."),r(a,"failWithoutStatusCode","죄송합니다. 시스템에서 문제가 발생했습니다. 오류가 지속되면 {brandName} 지원팀에 이 오류를 보고하세요."),r(a,"registeringWithoutStatusCode","죄송합니다. 문제가 발생하여 다시 연결하고 있습니다. 문제가 지속되면 {brandName} 지원팀에 이 오류를 보고하세요."),a);t.default=o},1657:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={cancel:"취소",close:"닫기",ok:"확인"}},1700:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={noResultFoundFor:"다음에 대한 결과가 없음",search:"검색"}},1717:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={copyToClipboard:"클립보드에 복사"}},1734:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l=r(u(547)),d=r(u(257)),n=r(u(93));function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var i=(o(a={},n.default.inbound,"수신"),o(a,n.default.outbound,"발신"),o(a,"status","상태:"),o(a,"InboundNumber","발신자 ID:"),o(a,"OutboundNumber","통화함:"),o(a,"InboundDirection","다음에서 수신:"),o(a,"OutboundDirection","다음으로 발신:"),o(a,d.default.noCall,"연결 끊김"),o(a,d.default.callConnected,"연결됨"),o(a,d.default.ringing,"벨 울림"),o(a,d.default.onHold,"대기 중"),o(a,d.default.parkedCall,"통화 대기됨"),o(a,l.default.unknown,"알 수 없음"),o(a,l.default.missed,"부재중"),o(a,l.default.callAccepted,"응답됨"),o(a,l.default.accepted,"응답됨"),o(a,l.default.voicemail,"음성 사서함"),o(a,l.default.rejected,"거부됨"),o(a,l.default.reply,"회신"),o(a,l.default.received,"수신됨"),o(a,l.default.faxReceiptError,"팩스 수신 오류"),o(a,l.default.faxOnDemand,"주문형 팩스"),o(a,l.default.partialReceive,"일부 수신"),o(a,l.default.blocked,"차단됨"),o(a,l.default.callConnected,"통화 연결됨"),o(a,l.default.noAnswer,"응답 없음"),o(a,l.default.internationalDisabled,"국제 전화 사용 안 함"),o(a,l.default.busy,"통화 중"),o(a,l.default.faxSendError,"팩스 전송 오류"),o(a,l.default.sent,"전송됨"),o(a,l.default.callFailed,"통화 실패"),o(a,l.default.internalError,"내부 오류"),o(a,l.default.IPPhoneOffline,"IP 전화기 오프라인"),o(a,l.default.restrictedNumber,"제한된 번호"),o(a,l.default.wrongNumber,"잘못된 번호"),o(a,l.default.stopped,"중지됨"),o(a,l.default.suspendedAccount,"일시 중단된 계정"),o(a,l.default.hangUp,"끊음"),o(a,l.default.HangUp,"끊음"),o(a,l.default.abandoned,"중단됨"),o(a,l.default.declined,"거부됨"),o(a,l.default.faxReceipt,"팩스 수신"),o(a,l.default.disconnected,"연결 끊김"),o(a,l.default.notAllowed,"허용되지 않음"),a);t.default=i},1751:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l=r(u(547)),d=r(u(257)),n=r(u(93));function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var i=(o(a={},n.default.inbound,"수신"),o(a,n.default.outbound,"발신"),o(a,"status","상태:"),o(a,"InboundNumber","발신자 ID:"),o(a,"OutboundNumber","통화함:"),o(a,"InboundDirection","다음에서 수신:"),o(a,"OutboundDirection","다음으로 발신:"),o(a,d.default.noCall,"연결 끊김"),o(a,d.default.callConnected,"연결됨"),o(a,d.default.ringing,"벨 울림"),o(a,d.default.onHold,"대기 중"),o(a,d.default.parkedCall,"통화 대기됨"),o(a,l.default.unknown,"알 수 없음"),o(a,l.default.missed,"부재중"),o(a,l.default.callAccepted,"응답됨"),o(a,l.default.accepted,"응답됨"),o(a,l.default.voicemail,"음성 사서함"),o(a,l.default.rejected,"거부됨"),o(a,l.default.reply,"회신"),o(a,l.default.received,"수신됨"),o(a,l.default.faxReceiptError,"팩스 수신 오류"),o(a,l.default.faxOnDemand,"주문형 팩스"),o(a,l.default.partialReceive,"일부 수신"),o(a,l.default.blocked,"차단됨"),o(a,l.default.callConnected,"통화 연결됨"),o(a,l.default.noAnswer,"응답 없음"),o(a,l.default.internationalDisabled,"국제 전화 사용 안 함"),o(a,l.default.busy,"통화 중"),o(a,l.default.faxSendError,"팩스 전송 오류"),o(a,l.default.sent,"전송됨"),o(a,l.default.callFailed,"통화 실패"),o(a,l.default.internalError,"내부 오류"),o(a,l.default.IPPhoneOffline,"IP 전화기 오프라인"),o(a,l.default.restrictedNumber,"제한된 번호"),o(a,l.default.wrongNumber,"잘못된 번호"),o(a,l.default.stopped,"중지됨"),o(a,l.default.suspendedAccount,"일시 중단된 계정"),o(a,l.default.hangUp,"끊음"),o(a,l.default.HangUp,"끊음"),o(a,l.default.abandoned,"중단됨"),o(a,l.default.declined,"거부됨"),o(a,l.default.faxReceipt,"팩스 수신"),o(a,l.default.disconnected,"연결 끊김"),o(a,l.default.notAllowed,"허용되지 않음"),a);t.default=i},1768:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={confirmationInfo:"이전 통화에 대한 저장되지 않은 편집 내용이 손실됩니다. 새 통화에 대해 작업하시겠습니까?",log:"기록",save:"저장 후 새로 작업",discard:"취소 후 새로 작업",stay:"이전 작업 유지"}},1785:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={mute:"음소거",unmute:"음소거 해제",hangup:"전화 끊기",reject:"거부"}},1802:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={log:"기록",save:"저장 후 새로 만들기",discard:"취소 후 새로 만들기",hangup:"끊기",reject:"음성 사서함에 보내기"}},1819:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={ringing:"수신 통화",callConnected:"통화 연결됨"}},1836:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={forward:"착신 전환",ignore:"무시",toVoicemail:"음성 사서함에 보내기",answer:"답변",endAndAnswer:"종료 후 응답",holdAndAnswer:"대기 후 응답",custom:"사용자 지정"}},1853:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={createCallLog:"통화 기록 만들기",viewInSalesforce:"Salesforce에서 보기"}},1872:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={noResultFoundFor:"다음에 대한 결과가 없음",foundFromServerHint:"키워드를 입력하고 Enter 키를 눌러 {appName}에서 검색",notResultFoundFromServer:"검색 결과 없음",loading:"로드 중..."}},1889:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={matched:"일치함",other:"기타",associated:"연결됨",foundFromServer:"{appName}에서 찾음"}},1906:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={dialPlaceholder:"이름 또는 번호 입력"}},1946:function(e,t,u){"use strict";u(1),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;t.default={today:"오늘",yesterday:"내일",empty:"통화 기록 없음"}},1970:function(e,t,u){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,u(1);var a,l,d=(a=u(546))&&a.__esModule?a:{default:a};function n(e,t,u){return t in e?Object.defineProperty(e,t,{value:u,enumerable:!0,configurable:!0,writable:!0}):e[t]=u,e}var r=(n(l={},d.default.webphoneUnavailable,"WebPhone을 사용할 수 없음"),n(l,d.default.offline,"오프라인"),n(l,d.default.voipOnly,"VoIP만"),n(l,d.default.survival,"제한 모드"),n(l,d.default.connecting,"연결 중"),l);t.default=r}}]);