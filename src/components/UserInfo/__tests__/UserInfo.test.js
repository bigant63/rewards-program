import { fireEvent, screen, waitFor } from '@testing-library/react';
import { syncInvokeUrlPromise } from '~/helpers/SyncModel';
import { FORM_FIELD_NAMES, getEligibilityError, GROUP_REVIEWER_REASON_KEYS } from '../helpers.js';
import ReviewerSelector from '../ReviewerSelector';
import strings from '../strings';
import {
  createMockValidationError,
  FormWrapper,
  groups,
  mockReviewers,
  renderWithMockQueryClientProvider,
  reviewerGenerator,
  users,
} from './test-helper';

const fieldProps = {
  value: [],
  values: { description: '', reviewers: [] },
  setValues: jest.fn(),
  setFieldError: jest.fn(),
  setFieldValue: jest.fn(),
  errors: {},
  name: 'reviewers',
};

const localProps = {
  reviewers: mockReviewers,
  spotManagers: [
    {
      id: 'owner',
      email: 'owner@example.com',
      displayName: 'Spot Owner',
      thumbnail: { url: 'https://example.com/image.png' },
      status: 'verified',
    },
    {
      id: 'co-owner',
      email: 'co-owner@example.com',
      displayName: 'Spot Co-owner',
      thumbnail: { url: 'https://example.com/image.png' },
      status: 'verified',
    },
  ],
  spotOwner: {
    id: 'owner',
    email: 'owner@example.com',
    displayName: 'Spot Owner',
    thumbnail: { url: 'https://example.com/image.png' },
    status: 'verified',
  },
  disabled: false,
  field: fieldProps,
  stepIndex: 1,
  spotId: '123',
  onShowNotification: jest.fn(),
  onSelectChange: jest.fn(),
  onSubmit: jest.fn(),
};

const {
  EMPTY_REVIEWER_SELECTION,
  REVIEWER_SELECTION_MAX,
  EMPTY_GROUP,
  UNVERIFIED_REVIEWER,
  UNREACHABLE_REVIEWER,
  REVIEWER_DELETED,
  REVIEWER_SUSPENDED,
  REVIEWER_LACKS_ACCESS,
  INVALID_LICENSE,
  INVALID_REVIEWER,
  REVIEWER_GROUP_MAX,
} = GROUP_REVIEWER_REASON_KEYS;

const component = (props = localProps) =>
  renderWithMockQueryClientProvider(
    <FormWrapper initialValues={{ [FORM_FIELD_NAMES.reviewers]: props.reviewers }} onSubmit={props.onSubmit}>
      <ReviewerSelector {...props} />
    </FormWrapper>
  );

jest.mock('../hooks/index', () => ({
  ...jest.requireActual('../hooks/index'),
}));

beforeEach(() => {
  syncInvokeUrlPromise.mockImplementation((options) => {
    let mockData = {};

    if (options.url.includes('/api/v1/search/suggestions?')) {
      mockData = { data: [users.at(1)] };
    } else {
      mockData = {
        data: { status: 'ok' },
      };
    }
    return Promise.resolve({ ...mockData });
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

it('should render without reviewers', () => {
  component({ ...localProps, reviewers: [] });
  expect(screen.getByLabelText(strings.labels.reviewers)).toBeInTheDocument();
  expect(screen.queryByText(getEligibilityError(EMPTY_REVIEWER_SELECTION, null, 1))).not.toBeInTheDocument();
});

it('should render with reviewers', async () => {
  component();
  expect(screen.getByLabelText(strings.labels.reviewers)).toBeInTheDocument();
  expect(screen.getByText(mockReviewers.at(0).displayName)).toBeInTheDocument();
});

it('should render SpotReviewerSelect as disabled when disabled is true', () => {
  const customProps = {
    ...localProps,
    disabled: true,
  };

  component(customProps);
  const selectorInput = screen.getByLabelText('Reviewers');
  expect(selectorInput).toBeInTheDocument();
  expect(selectorInput).toBeDisabled();
});

it('should render reviewer in the dropdown when the user does a search', async () => {
  const VALID_USER = {
    type: 'group',
    q: 'test',
    title: 'bag men',
    id: '9999998784845151',
    email: 'testgroup@highspot.com',
    verified: true,
  };

  syncInvokeUrlPromise.mockImplementation(() =>
    Promise.resolve({
      data: [VALID_USER],
    })
  );

  const customProps = {
    ...localProps,
    reviewers: [],
  };

  component(customProps);

  const selectorInput = screen.getByLabelText('Reviewers');
  fireEvent.change(selectorInput, { target: { value: 'group' } });

  await waitFor(() => {
    expect(syncInvokeUrlPromise).toHaveBeenCalledWith({ url: '/api/v1/search/suggestions?q=group&type=share' });
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByTitle(VALID_USER.title)).toBeInTheDocument();
  });
});

describe('validation errors', () => {
  it('should show max review error', () => {
    component({ ...localProps, reviewers: reviewerGenerator(11) });
    expect(screen.getByLabelText(strings.labels.reviewers)).toBeInTheDocument();
    expect(screen.getByText(getEligibilityError(REVIEWER_SELECTION_MAX))).toBeInTheDocument();
  });

  const validationTestFactory = (testDescription, validationKey) => {
    it(testDescription, async () => {
      syncInvokeUrlPromise.mockImplementation((options) => {
        let mockData = {};
        //syncInvokeUrlPromise calls the search API (/api/v1/search/suggestions)
        // otherwise if calls the validation API
        if (options.url.includes('/api/v1/search/suggestions?')) {
          mockData = { data: [users.at(1)] };
        } else {
          mockData = {
            data: createMockValidationError([{ key: validationKey, ids: [users.at(1).id], levelIndex: 0 }]),
          };
        }

        return Promise.resolve({ ...mockData });
      });
      component({ ...localProps, reviewers: [] });
      const selectorInput = screen.getByLabelText('Reviewers');
      fireEvent.change(selectorInput, { target: { value: users.at(1).displayName } });
      const reviewLabel = screen.getByLabelText(strings.labels.reviewers);
      expect(reviewLabel).toBeInTheDocument();
      const reviewOption = await screen.findByRole('option', { title: users.at(1).displayName });
      expect(reviewOption).toBeInTheDocument();

      fireEvent.focus(reviewOption);
      fireEvent.keyDown(reviewOption, { key: 'Enter' });
      const tagIndex = getEligibilityError(validationKey, '', 1).indexOf('<');
      const eligibilityError = await screen.findByText(
        getEligibilityError(validationKey, '', 1).substring(0, tagIndex).trim()
      );
      expect(eligibilityError).toBeInTheDocument();
      if (validationKey === REVIEWER_LACKS_ACCESS) {
        expect(screen.getByText('Grant access')).toBeInTheDocument();
      } else {
        const removeLink = await screen.findByRole('link', { name: /Remove/ });
        expect(removeLink).toBeInTheDocument();
      }
    });
  };

  [
    { description: 'should show invalid license user error', key: INVALID_LICENSE },
    { description: 'should show invalid reviewer user error', key: INVALID_REVIEWER },
    { description: 'should show unverified user error', key: UNVERIFIED_REVIEWER },
    { description: 'should show unreachable user error', key: UNREACHABLE_REVIEWER },
    { description: 'should show deleted user error', key: REVIEWER_DELETED },
    { description: 'should show suspended user error', key: REVIEWER_SUSPENDED },
    { description: 'should show empty group user error', key: EMPTY_GROUP },
    { description: 'should show lacks access user error', key: REVIEWER_LACKS_ACCESS },
  ].forEach(({ description, key }) => {
    validationTestFactory(description, key);
  });
});

it('should grant reviewer access when the reviewer lacks access', async () => {
  syncInvokeUrlPromise.mockImplementation((options) => {
    let mockData = {};

    if (options.url.includes('/api/v1/search/suggestions?')) {
      mockData = { data: [users.at(1)] };
    } else {
      mockData = {
        data: createMockValidationError([{ key: REVIEWER_LACKS_ACCESS, ids: [users.at(1).id], levelIndex: 0 }]),
      };
    }
    return Promise.resolve({ ...mockData });
  });

  component({ ...localProps, reviewers: [] });
  const selectorInput = screen.getByLabelText('Reviewers');
  fireEvent.change(selectorInput, { target: { value: users.at(1).displayName } });
  const reviewLabel = screen.getByLabelText(strings.labels.reviewers);
  expect(reviewLabel).toBeInTheDocument();
  const reviewOption = await screen.findByRole('option', { title: users.at(1).displayName });
  expect(reviewOption).toBeInTheDocument();

  fireEvent.focus(reviewOption);
  fireEvent.keyDown(reviewOption, { key: 'Enter' });
  const tagIndex = getEligibilityError(REVIEWER_LACKS_ACCESS, '', 1).indexOf('<');
  const eligibilityError = await screen.findByText(
    getEligibilityError(REVIEWER_LACKS_ACCESS, '', 1).substring(0, tagIndex).trim()
  );
  expect(eligibilityError).toBeInTheDocument();
  const grantAccessLink = screen.queryByText('Grant access');
  expect(grantAccessLink).toBeInTheDocument();
  fireEvent.click(grantAccessLink);

  await waitFor(() => {
    expect(syncInvokeUrlPromise).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ url: '/api/v1/spots/123/members', method: 'create' })
    );
  });

  expect(grantAccessLink).not.toBeInTheDocument();
});

it('should remove reviewers when the reviewer has a non-access error', async () => {
  syncInvokeUrlPromise.mockImplementation((options) => {
    let mockData = {};

    if (options.url.includes('/api/v1/search/suggestions?')) {
      mockData = { data: [users.at(1)] };
    } else {
      mockData = {
        data: createMockValidationError([{ key: REVIEWER_SUSPENDED, ids: [users.at(1).id], levelIndex: 0 }]),
      };
    }
    return Promise.resolve({ ...mockData });
  });

  component({ ...localProps, reviewers: [] });
  const selectorInput = screen.getByLabelText('Reviewers');
  fireEvent.change(selectorInput, { target: { value: users.at(1).displayName } });
  const reviewLabel = screen.getByLabelText(strings.labels.reviewers);
  expect(reviewLabel).toBeInTheDocument();
  const reviewOption = await screen.findByRole('option', { title: users.at(1).displayName });
  expect(reviewOption).toBeInTheDocument();

  fireEvent.focus(reviewOption);
  fireEvent.keyDown(reviewOption, { key: 'Enter' });
  const tagIndex = getEligibilityError(REVIEWER_SUSPENDED, '', 1).indexOf('<');
  const eligibilityError = await screen.findByText(
    getEligibilityError(REVIEWER_SUSPENDED, '', 1).substring(0, tagIndex).trim()
  );
  expect(eligibilityError).toBeInTheDocument();
  const removeReviewersLink = await screen.findByText('Remove reviewer');
  expect(removeReviewersLink).toBeInTheDocument();
  fireEvent.click(removeReviewersLink);
  await waitFor(() => {
    expect(eligibilityError).not.toBeInTheDocument();
  });

  expect(removeReviewersLink).not.toBeInTheDocument();
});

it('should remove multiple reviewers when remove reviewers is clicked', async () => {
  syncInvokeUrlPromise.mockImplementationOnce(() => {
    const mockData = {
      data: createMockValidationError([
        { key: REVIEWER_SUSPENDED, ids: [users.at(0).id, users.at(1).id], levelIndex: 0 },
      ]),
    };

    return Promise.resolve({ ...mockData });
  });

  component({ ...localProps, reviewers: [users.at(0), users.at(1)] });

  syncInvokeUrlPromise.mockImplementationOnce(() => {
    const mockData = {
      data: { status: 'ok' },
    };

    return Promise.resolve({ ...mockData });
  });

  const reviewLabel = screen.getByLabelText(strings.labels.reviewers);
  expect(reviewLabel).toBeInTheDocument();
  const firstReviewOption = await screen.findByTitle(
    users
      .at(0)
      .displayName.replace(/\([^)]*\)/, '')
      .trim()
  );
  expect(firstReviewOption).toBeInTheDocument();
  const secondReviewOption = await screen.findByTitle(
    users
      .at(1)
      .displayName.replace(/\([^)]*\)/, '')
      .trim()
  );
  expect(secondReviewOption).toBeInTheDocument();

  const eligibilityError = await screen.findByText(
    new RegExp(/ are ineligible to be reviewers because their accounts are suspended./)
  );
  expect(eligibilityError).toBeInTheDocument();
  const removeReviewersLink = await screen.findByText('Remove reviewers');
  expect(removeReviewersLink).toBeInTheDocument();
  fireEvent.click(removeReviewersLink);

  await waitFor(() => {
    expect(removeReviewersLink).not.toBeInTheDocument();
    expect(eligibilityError).not.toBeInTheDocument();
  });

  expect(firstReviewOption).not.toBeInTheDocument();
  expect(secondReviewOption).not.toBeInTheDocument();
});

describe('validation warnings', () => {
  it('should show max group warning', async () => {
    syncInvokeUrlPromise.mockImplementation((options) => {
      let mockData = {};

      if (options.url.includes('/api/v1/search/suggestions?')) {
        mockData = { data: [groups.at(1)] };
      } else {
        mockData = {
          data: [
            {
              [REVIEWER_GROUP_MAX]: [{ id: groups.at(1).id, count: 100 }],
              levelIndex: 0,
            },
          ],
        };
      }
      console.log('in call', mockData);
      return Promise.resolve({ ...mockData });
    });

    component({ ...localProps, reviewers: [] });
    const selectorInput = screen.getByLabelText('Reviewers');
    fireEvent.change(selectorInput, { target: { value: groups.at(1).displayName } });
    const reviewLabel = screen.getByLabelText(strings.labels.reviewers);
    expect(reviewLabel).toBeInTheDocument();

    const reviewOption = await screen.findByRole('option', { title: groups.at(1).displayName });
    expect(reviewOption).toBeInTheDocument();

    fireEvent.focus(reviewOption);
    fireEvent.keyDown(reviewOption, { key: 'Enter' });
    expect(localProps.onSelectChange).toHaveBeenCalled();
    await waitFor(() => {
      expect(localProps.onShowNotification).toHaveBeenCalled();
    });
  });
});

